import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import path from "path";
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config/config.env" });
const app = express();

const port = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- API Routes ---
// These MUST come BEFORE the catch-all route
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// --- Serve Static React App & Handle Page Refresh ---
// 1. Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// 2. The "catch-all" handler for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
