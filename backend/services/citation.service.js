import fetch from "node-fetch";

const MAX_CONTEXT_CHARS = 1500; // 🔥 critical for phi3:mini

function trimContext(text) {
  if (!text) return "";
  return text.length > MAX_CONTEXT_CHARS
    ? text.slice(0, MAX_CONTEXT_CHARS)
    : text;
}

async function generateAnswer(question, context, sources) {
  const safeContext = trimContext(context);

  const prompt = `
Answer ONLY using the context below.
If not found, say:
"No relevant answer found in the provided documents."

Context:
${safeContext}

Question:
${question}

Answer:
`;

  const ollamaResponse = await fetch(
    "http://localhost:11434/api/generate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:mini",
        prompt,
        stream: false,
        options: {
          num_ctx: 512,        // 🔥 memory safe
          num_predict: 120,    // 🔥 short answers
          temperature: 0.2     // 🔥 factual
        }
      }),
    }
  );

  if (!ollamaResponse.ok) {
    console.error("Ollama error:", await ollamaResponse.text());
    return {
      answer: "No relevant answer found in the provided documents.",
      sources,
    };
  }

  const data = await ollamaResponse.json();

  return {
    answer:
      data?.response?.trim() ||
      "No relevant answer found in the provided documents.",
    sources,
  };
}

export { generateAnswer };
