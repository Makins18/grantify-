import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize AI with stable environment variable access
const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { title, country, type, value, deadline, tone } = await req.json();

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are an elite, expert Grant Writer and Technical Proposal Architect working for Grantify, a premier strategic advisory firm focusing on opportunities in Africa.
Your task is to write a highly professional, compelling Expression of Interest (EOI) or preliminary grant proposal for the following specific opportunity:

Project Details:
- Title: ${title}
- Target Region/Country: ${country}
- Opportunity Type: ${type}
- Stated Value: ${value}
- Deadline: ${deadline}

Requested Tone: ${tone}

Instructions:
1. Write a comprehensive, multi-paragraph draft (about 250-400 words).
2. Adapt the language exactly to the requested tone (${tone}).
3. Use placeholder brackets (e.g., [Your Organization Name]) where user-specific input is required.
4. Ensure the content addresses the specific 'Opportunity Type' (e.g., if it's a Tender, focus on technical delivery and cost-efficiency. If it's a Grant, focus on sustainable impact and methodology. If it's a Scholarship, focus on academic excellence and future goals).
5. Output ONLY the raw proposal text. Do not include markdown code blocks or introductory conversational filler.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ draft: text });
    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
    }
}
