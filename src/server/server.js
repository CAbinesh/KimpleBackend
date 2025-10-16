/* eslint-disable no-undef */
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import User from "../models/user.js";
import Note from "../models/notes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


// ===== CORS =====
const corsOptions = {
  origin: 
    "https://kimplebackend-front.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));


// ===== MongoDB =====
try {
  await mongoose.connect(process.env.MONGO_URI, {
  });
  console.log("MongoDB Connected ✅");
} catch (err) {
  console.error("MongoDB Connection Error ❌:", err.message);
  process.exit(1);
}

// ===== JWT Secret =====
const JWT_SECRET = process.env.JWT_SECRET;

// ===== Rate Limiters =====
const notesLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 1000, // increased for deployment
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, try again later.",
});

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login/signup attempts, try again later.",
});

// ===== Auth Middleware =====
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not Authenticated" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ===== Validation =====
const signupValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name required")
    .isLength({ min: 3 }),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ===== Signup =====
app.post("/api/signup", authLimiter, signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required for HTTPS
      sameSite: "none", // allow cross-origin
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ user: { _id: user._id, fullName, email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message, message: "Server error" });
  }
});

// ===== Login =====
app.post("/api/login", authLimiter, loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    });

    res.json({
      user: { _id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message, message: "Server error" });
  }
});

// ===== Logout =====
app.post("/api/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  res.json({ message: "Logged out" });
});

// ===== Get Current User =====
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Server error" });
  }
});

// ===== Notes CRUD =====
app.use("/api/notes", notesLimiter);

// Create Note
app.post("/api/notes", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Content is required" });

    const note = new Note({ content, userId: req.user.id });
    await note.save();
    res.status(201).json({ note: { ...note.toObject(), id: note._id } });
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Server error" });
  }
});

// Get Notes
app.get("/api/notes/me", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notes.map((n) => ({ ...n.toObject(), id: n._id })));
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Server error" });
  }
});

// Update Note
app.put("/api/notes/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content: req.body.content },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Note not found" });
    res.json({ ...updated.toObject(), id: updated._id });
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Server error" });
  }
});

// Delete Note
app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Server error" });
  }
});

// ===== 404 Handler =====
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ===== Start Server =====
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));