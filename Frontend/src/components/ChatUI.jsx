import { useState } from "react";
import axios from "axios";

export default function ChatUI({ onNewChat }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim() || loading) return;

    const currentQuestion = question;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { role: "user", text: currentQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/chat/ask",
        { question: currentQuestion },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const answer = res.data.answer;

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: answer },
      ]);

      // 🔥 Notify Dashboard for history + stats
      onNewChat?.(currentQuestion, answer);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Failed to get response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") ask();
  };

  return (
    <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-xl">

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 font-semibold">
        AI Chat Assistant
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "mr-auto bg-white/10 text-white/90"
            }`}
          >
            {m.text}
          </div>
        ))}

        {/* 🔵 AI Typing Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-white/60">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
            <span className="text-xs ml-2">AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SOP-related question..."
          className="flex-1 px-3 py-2 rounded bg-black/30 outline-none text-sm"
        />
        <button
          onClick={ask}
          disabled={loading}
          className={`px-4 rounded font-semibold text-sm transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
