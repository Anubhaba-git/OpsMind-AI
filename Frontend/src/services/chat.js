import api from "./api";

export const askQuestion = async (question) => {
  const res = await api.post("/chat/ask", { question });
  return res.data;
};
