import axios from "axios";

const OLLAMA_URL = "http://localhost:11434";

/**
 * Generate embedding using Ollama (local)
 */
export async function generateEmbedding(text) {
  const response = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
    model: "nomic-embed-text",
    prompt: text
  });

  return response.data.embedding;
}
