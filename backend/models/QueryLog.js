const mongoose = require("mongoose");

const QueryLogSchema = new mongoose.Schema({
  query: String,
  document: String,
  timestamp: Date
});

module.exports = mongoose.model("QueryLog", QueryLogSchema);
