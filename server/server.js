const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const { authRateLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const careerRoutes = require("./routes/career");
const goalsRoutes = require("./routes/goals");
const assessmentsRoutes = require("./routes/assessments");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const parsedEnvOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(",") : []),
]
  .map((origin) => String(origin || "").trim())
  .filter(Boolean);

const allowedOrigins = new Set(parsedEnvOrigins);

const isLocalhostOrigin = (origin) => /^http:\/\/localhost:\d+$/.test(origin);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no origin header).
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      // In development, allow localhost ports so Vite can run on fallback ports.
      if (process.env.NODE_ENV !== "production" && isLocalhostOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/assessments", assessmentsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

bootstrap();
