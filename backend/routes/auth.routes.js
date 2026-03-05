import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  await User.create({
    name,
    email: email.toLowerCase().trim(),
    password: password.trim(), // ❗ NO bcrypt here
  });

  res.json({ message: "User registered successfully" });
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password.trim();

  console.log("LOGIN PASSWORD (RAW):", password);

  const user = await User.findOne({ email });
  console.log("USER FOUND:", user);

  const ok = await bcrypt.compare(password, user.password);
  console.log("PASSWORD MATCH:", ok);

  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

export default router;
