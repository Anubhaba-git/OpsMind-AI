const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  filename: String,
  pages: Number,
  uploadedBy: String,
  uploadedAt: Date
});

module.exports = mongoose.model("Document", DocumentSchema);
