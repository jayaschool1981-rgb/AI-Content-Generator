const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

/* =========================
   ENVIRONMENT VALIDATION
========================= */

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "GEMINI_MODEL"
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ ${key} is missing in environment variables`);
    process.exit(1);
  }
});

/* =========================
   SECURITY MIDDLEWARE
========================= */

// Secure HTTP headers
app.use(helmet());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* =========================
   CORS CONFIGURATION
========================= */

// Allow local + all Vercel deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Allow localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow ANY vercel deployment
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

/* =========================
   BODY PARSER
========================= */

app.use(express.json({ limit: "10kb" }));

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RankPilot AI API Running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

/* =========================
   ROUTES
========================= */

const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

app.use("/api", authRoutes);
app.use("/api", aiRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});