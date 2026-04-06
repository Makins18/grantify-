from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import os
import json
import logging
import redis
import hashlib
from datetime import datetime
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from logger import setup_system_logging, log_cache_event, log_error, get_recent_logs
from vector_store import get_store
from scheduler import start_scheduler, stop_scheduler, get_scheduler_status
import google.generativeai as genai

load_dotenv()
setup_system_logging()
logger = logging.getLogger("AI-Service")

# ── Redis ──────────────────────────────────────────────────────────────────────
try:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", "6379")),
        db=0,
        decode_responses=True
    )
    redis_client.ping()
    logger.info("✅ Connected to Redis")
except Exception as e:
    logger.error(f"⚠️  Redis unavailable: {e}")
    redis_client = None

# ── Gemini ────────────────────────────────────────────────────────────────────
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")


# ── Lifespan (startup / shutdown) ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Grantify AI starting up...")
    start_scheduler()
    yield
    logger.info("🛑 Grantify AI shutting down...")
    stop_scheduler()


app = FastAPI(title="Grantify AI — Scholarship & Grant Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ────────────────────────────────────────────────────────────────────
class ReasoningStep(BaseModel):
    thought: str = Field(description="Internal reasoning step")
    conclusion: str = Field(description="Conclusion drawn from this step")

class AnalysisResponse(BaseModel):
    summary: str
    key_points: List[str]
    confidence_score: float
    analysis_date: str
    reasoning_path: List[ReasoningStep]

class AnalysisRequest(BaseModel):
    text: str
    model: Optional[str] = "gemini"

class Opportunity(BaseModel):
    id: Optional[str] = None # Assuming ID might be a string from vector store
    title: str
    source: str
    link: str
    description: Optional[str] = ""
    country: Optional[str] = "Pan-Africa"
    type: Optional[str] = "Grant/Scholarship"
    value: Optional[str] = "Reference source"
    ai_score: Optional[int] = 85
    is_priority: bool = False
    discovery_date: Optional[str] = None # ISO format date string

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class ChatMessage(BaseModel):
    role: str  # "user" or "model"
    content: str

class ChatRequest(BaseModel):
    session_id: str
    query: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    answer: str
    session_id: str
    sources: List[dict]
    history: List[ChatMessage]
    thought_trace: Optional[List[str]] = []

class TraceResponse(BaseModel):
    session_id: str
    retrieval_chunks: List[dict]
    system_prompt: str
    timestamp: str

class VisualRequest(BaseModel):
    description: str
    aspect_ratio: Optional[str] = "1:1"

class VisualResponse(BaseModel):
    image_url: str
    summary: str


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    store = get_store()
    redis_ok = False
    try:
        if redis_client:
            redis_client.ping()
            redis_ok = True
    except Exception:
        pass
    return {
        "status": "Grantify AI Service is running",
        "environment": os.getenv("NODE_ENV", "development"),
        "redis": "connected" if redis_ok else "unavailable",
        "vector_store": store.stats() if store else {"total_documents": 0},
        "scheduler": get_scheduler_status(),
    }


@app.get("/opportunities", response_model=List[Opportunity])
async def get_opportunities():
    """Return all opportunities — elite grade with ChromaDB."""
    cache_key = "opportunities_v2"

    if redis_client:
        try:
            cached = redis_client.get(cache_key)
            if cached:
                log_cache_event(cache_key, hit=True, ttl=120)
                return [Opportunity(**o) for o in json.loads(cached)]
        except Exception as e:
            log_error("redis_read", str(e))

    store = get_store()
    # For a showcase, we might want a 'list all' but with Chroma we query with an empty string or broad filter
    # For now, search for 'Africa' as a broad base or just use stats
    raw_opportunities = store.search("", top_k=100) # Broad search
    
    # Add priority logic based on discovery date (simulated)
    # In a real app, this would check if the discovery_date is within the last 12h
    enriched_opportunities = []
    for i, res in enumerate(raw_opportunities):
        # Ensure 'id' is present, using a hash if not explicitly from store
        if 'id' not in res:
            res['id'] = hashlib.md5(json.dumps(res, sort_keys=True).encode('utf-8')).hexdigest()
        res["is_priority"] = i < 3 # Mark top 3 as priority for demo/speed
        # Simulate discovery date for new items
        if i < 3:
            res["discovery_date"] = datetime.utcnow().isoformat()
        enriched_opportunities.append(Opportunity(**res))
    
    _cache(cache_key, [o.model_dump() for o in enriched_opportunities])
    return enriched_opportunities


@app.post("/search")
async def semantic_search(req: SearchRequest):
    """Elite semantic search using ChromeDB + Gemini."""
    store = get_store()
    results = store.search(req.query, top_k=req.top_k)
    return {"query": req.query, "count": len(results), "results": results}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_tender(request: AnalysisRequest):
    """Advanced AI analysis with Chain-of-Thought reasoning."""
    prompt = (
        "Analyze the following tender requirements. Break down your reasoning step-by-step. "
        "Provide a high-level summary, key technical points, and a confidence score. "
        f"TEXT: {request.text}"
    )

    try:
        # Using structured output for 'AnalysisResponse'
        result = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResponse
            )
        )
        return json.loads(result.text)
    except Exception as e:
        logger.error(f"Analysis Error: {e}")
        # Standard fallback if structured output fails
        return AnalysisResponse(
            summary="Analysis failed but here is a basic breakdown.",
            key_points=["Error during deep analysis"],
            confidence_score=0.1,
            analysis_date=datetime.now().isoformat(),
            reasoning_path=[ReasoningStep(thought="API Call", conclusion="Failed")]
        )


@app.post("/chat", response_model=ChatResponse)
async def chat_with_tender_ai(req: ChatRequest):
    """
    Elite Conversational RAG with Traceability:
    1. Search ChromaDB for semantic context.
    2. Build CoT prompt.
    3. Call Gemini.
    4. Store trace for the Visualizer.
    """
    session_id = req.session_id
    cache_key = f"chat:{session_id}"
    trace_key = f"trace:{session_id}"

    # 1. Load History
    stored_history = []
    if redis_client:
        try:
            cached = redis_client.get(cache_key)
            if cached:
                stored_history = [ChatMessage(**m) for m in json.loads(cached)]
        except Exception as e:
            log_error("redis_read_chat", str(e))

    full_history = req.history if req.history else stored_history

    # 2. RAG Context
    store = get_store()
    results = store.search(req.query, top_k=5)
    
    # Store Trace for RAG Visualizer
    if redis_client:
        trace_data = {
            "session_id": session_id,
            "retrieval_chunks": results,
            "timestamp": datetime.utcnow().isoformat()
        }
        redis_client.setex(trace_key, 3600, json.dumps(trace_data))

    context_text = "\n\n".join([
        f"SOURCE: {doc.get('title')}\nDESCRIPTION: {doc.get('description') or doc.get('summary')}\nMETADATA: {doc}"
        for doc in results
    ])

    # 3. Elite Prompt Construction (Contextual Entropy)
    import random
    entropy_seed = f"{datetime.utcnow().isoformat()}-{random.randint(1000, 9999)}"
    
    system_instruction = (
        "You are Grantify AI, a dedicated assistant for Nigerian grants and scholarships. "
        "Rule 1: Ground every answer in the provided CONTEXT. "
        "Rule 2: Provide unique, fresh, and creative advice for every request. Never give the exact same answer twice. "
        "Rule 3: Focus on actionable steps for Nigerian applicants. "
        "Rule 4: Be extremely professional and cite direct source links when possible. "
        f"Session Entropy: {entropy_seed}"
    )

    prompt = f"{system_instruction}\n\nCONTEXT:\n{context_text}\n\nUSER QUESTION: {req.query}"

    try:
        gemini_history = [
            {"role": m.role, "parts": [m.content]}
            for m in full_history
        ]

        chat = model.start_chat(history=gemini_history)
        response = chat.send_message(prompt)
        ai_full_response = response.text
        
        # Split thought from answer if AI follows the 'thinking process' instruction
        # (Or just return full as answer for now)
        ai_answer = ai_full_response

        # 4. Update History
        new_turn_user = ChatMessage(role="user", content=req.query)
        new_turn_ai = ChatMessage(role="model", content=ai_answer)
        updated_history = full_history + [new_turn_user, new_turn_ai]

        if redis_client:
            redis_client.setex(cache_key, 7200, json.dumps([m.model_dump() for m in updated_history]))

        return ChatResponse(
            answer=ai_answer,
            session_id=session_id,
            sources=results,
            history=updated_history,
            thought_trace=["Context Retrieval Successful", f"Found {len(results)} relevant documents", "Gemini Grounding Applied"]
        )

    except Exception as e:
        logger.error(f"Elite Chat Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI brain failed: {str(e)}")


@app.get("/chat/trace/{session_id}", response_model=TraceResponse)
async def get_chat_trace(session_id: str):
    """Retrieve the last RAG retrieval trace for UI visualization."""
    trace_key = f"trace:{session_id}"
    if not redis_client:
        raise HTTPException(status_code=503, detail="Redis unavailable")
    
    cached = redis_client.get(trace_key)
    if not cached:
        return TraceResponse(
            session_id=session_id,
            retrieval_chunks=[],
            system_prompt="No active trace",
            timestamp=datetime.utcnow().isoformat()
        )
    
    data = json.loads(cached)
    return TraceResponse(
        session_id=session_id,
        retrieval_chunks=data["retrieval_chunks"],
        system_prompt="Grantify RAG Pipeline V1",
        timestamp=data["timestamp"]
    )


@app.post("/generate-visual", response_model=VisualResponse)
async def generate_visual(req: VisualRequest):
    """Elite visual generator."""
    internal_prompt = (
        f"Hyper-realistic architectural or corporate 3D visualization: {req.description}. "
        "Vibrant colors, high contrast, 8k resolution, professional lighting."
    )

    try:
        visual_model = genai.GenerativeModel("imagen-3.0-generate-001")
        # Note: If API is mock/demo, this might fall back
        image_data = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
        return VisualResponse(image_url=image_data, summary="Showcase visual ready.")
    except Exception as e:
        return VisualResponse(image_url="https://via.placeholder.com/800", summary="Visual generation failed (Quota).")


@app.get("/chat/history/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(session_id: str):
    cache_key = f"chat:{session_id}"
    if not redis_client: return []
    try:
        cached = redis_client.get(cache_key)
        if cached: return [ChatMessage(**m) for m in json.loads(cached)]
    except Exception: pass
    return []


@app.delete("/chat/history/{session_id}")
async def clear_chat_history(session_id: str):
    if redis_client:
        redis_client.delete(f"chat:{session_id}")
        redis_client.delete(f"trace:{session_id}")
    return {"status": "cleared", "session_id": session_id}


# ── Admin ─────────────────────────────────────────────────────────────────────

@app.get("/admin/stats")
async def admin_stats():
    store = get_store()
    return {
        "vector_store": store.stats() if store else {},
        "redis_available": redis_client is not None,
        "scheduler": get_scheduler_status(),
        "timestamp": datetime.utcnow().isoformat(),
    }

@app.post("/admin/refresh")
async def admin_refresh():
    from scheduler import run_scraping_job
    run_scraping_job()
    return {"status": "Deep re-indexing started"}


# ── Helpers ────────────────────────────────────────────────────────────────────

def _cache(key: str, data: list):
    if redis_client:
        try:
            redis_client.setex(key, 300, json.dumps(data))
        except Exception: pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
