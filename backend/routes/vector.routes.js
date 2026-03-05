import express from "express";
import Chunk from "../models/Chunk.js";
import { generateEmbedding } from "../services/embedding.service.js";

const router = express.Router();

/*
  POST /api/vector/build
  Generates embeddings for chunks that don't have them yet
*/
router.post("/build", async (req, res) => {
  try {
    const chunks = await Chunk.find({
      $or: [
        { embedding: { $exists: false } },
        { embedding: { $size: 0 } }
      ]
    });

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.text);
      chunk.embedding = embedding;
      await chunk.save();
    }

    res.json({
      message: "Vector embeddings generated successfully",
      totalChunks: chunks.length
    });
  } catch (error) {
    console.error("VECTOR ERROR:", error);
    res.status(500).json({
      error: "Vector build failed",
      details: error.message
    });
  }
});

export default router;
