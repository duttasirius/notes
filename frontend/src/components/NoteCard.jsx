import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { updateNote, deleteNote } from "../redux/noteSlice.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function NoteCard({ note }) {
  const dispatch = useDispatch();

  // Store the edit form values
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Show or hide the edit form
  const [isEditing, setIsEditing] = useState(false);

  // Track API requests and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Open the edit form
  const handleEdit = () => {
    setTitle(note.title);
    setContent(note.content);
    setError("");
    setIsEditing(true);
  };

  // Send updated data to the backend
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.put(`${API_URL}/api/notes/${note._id}`, {
        title: title.trim(),
        content: content.trim(),
      });

      // Update the note in Redux
      dispatch(updateNote(response.data.data));

      // Close the edit form
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update note.");
    } finally {
      setLoading(false);
    }
  };

  // Delete this note
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmDelete) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.delete(`${API_URL}/api/notes/${note._id}`);

      // Remove the note from Redux
      dispatch(deleteNote(note._id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {isEditing ? (
        // Edit form
        <form onSubmit={handleUpdate}>
          <h3 className="text-lg font-semibold">Edit Note</h3>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Note title"
            maxLength={150}
            required
            disabled={loading}
            className="mt-4 w-full rounded-lg border border-gray-300 p-3"
          />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Note content"
            rows={4}
            required
            disabled={loading}
            className="mt-3 w-full rounded-lg border border-gray-300 p-3"
          />

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setIsEditing(false);
                setError("");
              }}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // Normal note display
        <>
          <h3 className="break-words text-lg font-semibold text-gray-900">
            {note.title}
          </h3>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm text-gray-600">
            {note.content}
          </p>

          <p className="mt-4 text-xs text-gray-400">
            Created: {new Date(note.createdAt).toLocaleString()}
          </p>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleEdit}
              disabled={loading}
              className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700 disabled:opacity-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default NoteCard;
