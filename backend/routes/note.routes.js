import express from "express";

import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const router = express.Router();

// Create a note
router.post("/", createNote);

// Get all notes or search by keyword
router.get("/", getNotes);

// Update an existing note
router.put("/:id", updateNote);

// Delete a note
router.delete("/:id", deleteNote);

export default router;
