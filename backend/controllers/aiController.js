import { model } from "../config/gemini.js";

export const aiSearch = async (req, res) => {
  const { query } = req.body;

  const result = await model.generateContent(query);
  const response = result.response.text();

  res.json({ answer: response });
};
