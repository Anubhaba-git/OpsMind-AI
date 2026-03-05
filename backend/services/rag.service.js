import axios from "axios";
import Chunk from "../models/Chunk.js";
import { generateEmbedding } from "./embedding.service.js";
import { cosineSimilarity } from "../utils/cosine.js";

const OLLAMA_URL = "http://localhost:11434";
const LLM_MODEL = "phi3:mini";

export async function askQuestion(question) {
  // 1) Embed the question
  const qEmbedding = await generateEmbedding(question);

  // 2) Fetch chunks with embeddings
  const chunks = await Chunk.find({ embedding: { $exists: true, $ne: [] } });

  // 3) Score by cosine similarity
  const scored = chunks
    .map((c) => ({
      chunk: c,
      score: cosineSimilarity(qEmbedding, c.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // top-3 context

  // 4) Build context + citations
  const context = scored
    .map(
      (s, i) =>
        `[${i + 1}] (${s.chunk.filename}, page ${s.chunk.page}) ${s.chunk.text}`
    )
    .join("\n\n");

  // 5) Ask LLM with grounding
  const prompt = `
You are an enterprise SOP assistant.

Rules:
- Use ONLY the provided context
- Do NOT add assumptions
- Do NOT explain beyond the context
- Answer in 2–3 simple sentences
- End sentences with citations like [1]

Context:
${context}

Question:
${question}

Answer:
`;

  const llm = await axios.post(
    `${OLLAMA_URL}/api/generate`,
    {
      model: LLM_MODEL,
      prompt,
      stream: false,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  // 6) Return answer + sources
  return {
    answer: llm.data.response.trim(),
    sources: scored.map((s, i) => ({
      ref: i + 1,
      filename: s.chunk.filename,
      page: s.chunk.page,
    })),
  };
}
