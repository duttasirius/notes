import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import noteRoutes from "./routes/note.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notes Management API is running",
  });
});

// Notes CRUD and search APIs
app.use("/api/notes", noteRoutes);

// Handle unknown routes and application errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
