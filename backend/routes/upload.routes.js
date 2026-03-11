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

    /* ============================
       PDF PARSE ERROR
    ============================ */
    pdfParser.on("pdfParser_dataError", (err) => {
      console.error("PDF PARSE ERROR:", err);

      return res.status(500).json({
        error: "PDF processing failed",
        details: err.parserError,
      });
    });

    /* ============================
       PDF PARSED SUCCESSFULLY
    ============================ */
    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      try {
        const chunks = [];

        pdfData.Pages.forEach((page, pageIndex) => {
          let pageText = "";

          page.Texts.forEach((t) => {
            pageText += decodeURIComponent(t.R[0].T) + " ";
          });

          // split page text into chunks
          const pageChunks = chunkText(pageText, 40);

          pageChunks.forEach((chunk) => {
            const cleanChunk = chunk.trim();

            // ⭐ skip empty chunks
            if (!cleanChunk) return;

            chunks.push({
              filename: req.file.filename,
              text: cleanChunk,
              page: pageIndex + 1,
            });
          });
        });

        // ⭐ extra safety filter
        const validChunks = chunks.filter(
          (c) => c.text && c.text.trim().length > 0
        );

        // remove old chunks of same file
        await Chunk.deleteMany({ filename: req.file.filename });

        // store chunks
        await Chunk.insertMany(validChunks);

        return res.json({
          message: "PDF uploaded, chunked & stored successfully",
          filename: req.file.filename,
          totalPages: pdfData.Pages.length,
          totalChunks: validChunks.length,
        });

      } catch (dbError) {
        console.error("CHUNK SAVE ERROR:", dbError);

        return res.status(500).json({
          error: "Failed to store PDF chunks",
          details: dbError.message,
        });
      }
    });

    /* ============================
       Start PDF Parsing
    ============================ */
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