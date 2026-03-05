import express from "express";
import { askQuestion } from "../services/rag.service.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const result = await askQuestion(question);
    res.json(result);
  } catch (err) {
  console.error("RAG ERROR FULL:", err);
  res.status(500).json({
    error: "RAG failed",
    details: err.message
  });
}

});

export default router;
