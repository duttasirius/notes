import mongoose from "mongoose";
import Note from "../models/note.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/notes — Create a note
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
    });
  }

  const note = await Note.create({
    title: title.trim(),
    content: content.trim(),
  });

  return res.status(201).json({
    success: true,
    data: note,
  });
};

// GET /api/notes?search=keyword — Get or search notes
export const getNotes = async (req, res) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  const filter = search
    ? {
        $or: [
          {
            title: {
              $regex: escapeRegex(search),
              $options: "i",
            },
          },
          {
            content: {
              $regex: escapeRegex(search),
              $options: "i",
            },
          },
        ],
      }
    : {};

  const notes = await Note.find(filter).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
};

// PUT /api/notes/:id — Update a note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
    });
  }

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
    });
  }

  const note = await Note.findByIdAndUpdate(
    id,
    {
      title: title.trim(),
      content: content.trim(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: note,
  });
};

// DELETE routes - /api/notes/:id — Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
    });
  }

  const note = await Note.findByIdAndDelete(id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
};
