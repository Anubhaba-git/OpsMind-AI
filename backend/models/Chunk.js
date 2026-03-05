import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    text: { type: String, required: true },
    page: { type: Number, required: true },
    embedding: { type: [Number], default: [] } // 🔥 VECTOR
  },
  { timestamps: true }
);

export default mongoose.model("Chunk", chunkSchema);
