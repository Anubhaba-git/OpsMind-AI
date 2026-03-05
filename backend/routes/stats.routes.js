import express from "express";
import auth from "../middleware/auth.js";
import Chunk from "../models/Chunk.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const documents = await Chunk.distinct("filename");

    res.json({
      documents: documents.length,
      queries: 0,
      accuracy: "92%",
    });
  } catch (err) {
    res.status(500).json({ error: "Stats fetch failed" });
  }
});

export default router;
