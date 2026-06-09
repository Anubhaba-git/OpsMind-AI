import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import vectorRoutes from "./routes/vector.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import statsRoutes from "./routes/stats.routes.js";

dotenv.config({ path: "./.env" }); // load env variables

const MONGO_URI = process.env.MONGO_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 8000;

console.log("MONGO_URI:", MONGO_URI);
console.log("GEMINI_API_KEY loaded:", !!GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   API Routes
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/vector", vectorRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stats", statsRoutes);

/* ============================
   MongoDB Connection
============================ */
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ============================
   Start Server
============================ */
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});