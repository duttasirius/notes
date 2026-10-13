import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { FiPlus, FiLoader } from "react-icons/fi";

import { addNote } from "../redux/noteSlice.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function NoteForm({ searchTerm = "" }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setFormError("Both title and content are required.");
      setSuccessMessage("");
      return;
    }

    setSaving(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(`${API_URL}/api/notes`, {
        title: trimmedTitle,
        content: trimmedContent,
      });

      const createdNote = response.data.data;

      // Keep the current search results accurate.
      const keyword = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !keyword ||
        createdNote.title.toLowerCase().includes(keyword) ||
        createdNote.content.toLowerCase().includes(keyword);

      if (matchesSearch) {
        dispatch(addNote(createdNote));
      }

      setTitle("");
      setContent("");
      setSuccessMessage("Note created successfully!");
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Failed to create note. Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FiPlus size={21} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Create a new note
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Write down an idea before you forget it.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="note-title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Learn React"
          maxLength={150}
          required
          disabled={saving}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-50"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="note-content"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Content
        </label>

        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={4}
          required
          disabled={saving}
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-50"
        />
      </div>

      {formError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {formError}
        </p>
      )}

      {successMessage && (
        <p role="status" className="mt-4 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <>
            <FiLoader className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiPlus />
            Create Note
          </>
        )}
      </button>
    </form>
  );
}

export default NoteForm;
