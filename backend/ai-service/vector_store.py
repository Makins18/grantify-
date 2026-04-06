"""
TenderSense AI — Advanced Vector Store
Manages ChromaDB-based embeddings of opportunities for semantic search and RAG.
Uses Google Gemini Embeddings for industry-leading retrieval accuracy.
"""
import os
import logging
import chromadb
from chromadb.config import Settings
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path
import google.generativeai as genai

logger = logging.getLogger("VectorStore")

# Paths
BASE_DIR = Path(__file__).parent
VECTORS_DIR = (BASE_DIR / ".." / ".." / "data" / "vectors").resolve()
VECTORS_DIR.mkdir(parents=True, exist_ok=True)

# Gemini Configuration for Embeddings
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class VectorStore:
    """Professional Vector Store backed by ChromaDB and Gemini Embeddings."""

    def __init__(self):
        # Initialize Client without Settings for recent chromadb versions if preferred, 
        # or use Settings(allow_reset=True) for testing
        self.client = chromadb.PersistentClient(path=str(VECTORS_DIR))
        self.collection = self.client.get_or_create_collection(
            name="opportunities",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info(f"[VectorStore] Initialized ChromaDB at {VECTORS_DIR}")

    def _get_embedding(self, text: str) -> List[float]:
        """Fetch high-fidelity embedding from Gemini."""
        try:
            # Clean text to avoid excessive length for embeddings if needed
            cleaned_text = text.replace("\n", " ")[:8192]
            result = genai.embed_content(
                model="models/embedding-001",
                content=cleaned_text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"[VectorStore] Embedding error: {e}")
            # Fallback to zeros to avoid crashing the whole ingestion, 
            # though better to raise in a real production environment
            return [0.0] * 768 

    def upsert(self, items: List[Dict]) -> Dict[str, int]:
        """Add or update items in ChromaDB."""
        ids = []
        embeddings = []
        metadatas = []
        documents = []
        
        added = 0
        skipped = 0

        for item in items:
            # Create a unique ID based on link hash
            link = item.get("link", "")
            title = item.get("title", "")
            import hashlib
            doc_id = hashlib.md5(f"{link}{title}".encode()).hexdigest()
            
            text = f"{title} {item.get('description', item.get('summary',''))} {item.get('type','')} {item.get('country', item.get('location',''))}"
            
            ids.append(doc_id)
            embeddings.append(self._get_embedding(text))
            
            # Clean metadata (Chroma only accepts simple types: str, int, float, bool)
            metadata = {
                "title": str(item.get("title", "Unknown")),
                "source": str(item.get("source", "Unknown")),
                "link": str(item.get("link", "#")),
                "country": str(item.get("country", "Africa")),
                "type": str(item.get("type", "Opportunity")),
                "ai_score": int(item.get("ai_score", 85)),
                "indexed_at": datetime.utcnow().isoformat()
            }
            metadatas.append(metadata)
            documents.append(text)
            added += 1

        if ids:
            self.collection.upsert(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents
            )
            
        return {"added": added, "skipped": skipped, "total": self.collection.count()}

    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Elite semantic search using Gemini embeddings."""
        try:
            query_embedding = self._get_embedding(query)
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            # Format results back to standard dicts
            docs = []
            if results['metadatas'] and results['metadatas'][0]:
                for i, meta in enumerate(results['metadatas'][0]):
                    docs.append({
                        **meta,
                        "id": results['ids'][0][i],
                        "distance": results['distances'][0][i] if 'distances' in results else None
                    })
            return docs
        except Exception as e:
            logger.error(f"[VectorStore] Search error: {e}")
            return []

    def stats(self) -> Dict:
        return {
            "total_documents": self.collection.count(),
            "engine": "ChromaDB",
            "embedding_model": "models/embedding-001",
            "storage_path": str(VECTORS_DIR),
        }

    def clear(self):
        self.client.delete_collection("opportunities")
        self.collection = self.client.get_or_create_collection(name="opportunities")
        logger.warning("[VectorStore] Collection cleared.")

# Singleton
_store: Optional[VectorStore] = None

def get_store() -> VectorStore:
    global _store
    if _store is None:
        _store = VectorStore()
    return _store
