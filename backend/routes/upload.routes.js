import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
import { chunkText } from "../utils/chunker.js";
import Chunk from "../models/Chunk.js";

const require = createRequire(import.meta.url);
const PDFParser = require("pdf2json");

const router = express.Router();

/* ============================
   Multer Storage Configuration
============================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ============================
   PDF Upload + Chunk + Store
   POST /api/upload/pdf
============================ */
router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);
    const pdfParser = new PDFParser();

    // ❌ PDF parse error
    pdfParser.on("pdfParser_dataError", (err) => {
      console.error("PDF PARSE ERROR:", err);
      return res.status(500).json({
        error: "PDF processing failed",
        details: err.parserError,
      });
    });

    // ✅ PDF parsed successfully
    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      const chunks = [];

      pdfData.Pages.forEach((page, pageIndex) => {
        let pageText = "";

        page.Texts.forEach((t) => {
          pageText += decodeURIComponent(t.R[0].T) + " ";
        });

        // chunk per page (40 words per chunk)
        const pageChunks = chunkText(pageText, 40);

        pageChunks.forEach((chunk) => {
          chunks.push({
            filename: req.file.filename,
            text: chunk.trim(),
            page: pageIndex + 1,
          });
        });
      });

      // 🔥 MongoDB: remove old chunks of same file
      await Chunk.deleteMany({ filename: req.file.filename });

      // 🔥 MongoDB: store new chunks
      await Chunk.insertMany(chunks);

      return res.json({
        message: "PDF uploaded, chunked & stored successfully",
        filename: req.file.filename,
        totalPages: pdfData.Pages.length,
        totalChunks: chunks.length,
      });
    });

    // start parsing PDF
    pdfParser.loadPDF(filePath);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      error: "PDF upload failed",
      details: error.message,
    });
  }
});

export default router;
