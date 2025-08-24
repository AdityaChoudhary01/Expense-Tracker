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

// ES Module equivalent of __dirname to work with import syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config/config.env" });
const app = express();

// Use the PORT from environment variables or default to 5000
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
// Your API routes must be defined BEFORE the static file serving and catch-all route.
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// --- Serve Static React App & Handle Page Refresh ---
// This section is the definitive fix for the "Not Found" error.

// 1. Serve static files (HTML, CSS, JS) from the React app's 'build' directory.
app.use(express.static(path.join(__dirname, "../frontend/build")));

// 2. The "catch-all" handler: For any request that doesn't match an API route above,
//    it sends back the main index.html file from the React build folder.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
