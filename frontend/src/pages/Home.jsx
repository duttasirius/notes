import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiX } from "react-icons/fi";

import { setNotes, setLoading, setError } from "../redux/noteSlice.js";

import NoteForm from "../components/NoteForm.jsx";
import NoteCard from "../components/NoteCard.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Home() {
  const dispatch = useDispatch();

  const { notes, loading, error } = useSelector((state) => state.note);

  // Store the text entered in the search box
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch notes whenever the page loads or the search changes
  useEffect(() => {
    const fetchNotes = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        // Send the search keyword to the backend
        const response = await axios.get(`${API_URL}/api/notes`, {
          params: searchTerm.trim() ? { search: searchTerm.trim() } : {},
        });

        // Save the returned notes in Redux
        dispatch(setNotes(response.data.data));
      } catch (err) {
        dispatch(
          setError(
            err.response?.data?.message ||
              "Could not load notes. Please check your backend.",
          ),
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchNotes();
  }, [dispatch, searchTerm]);

  // Clear the search box
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Notes Manager
          </h1>

          <p className="mt-3 text-gray-600">
            Create, manage, and search your notes in one place.
          </p>
        </header>

        {/* Create Note component */}
        <NoteForm searchTerm={searchTerm.trim()} />

        {/* Search section */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Your Notes</h2>

          <p className="mt-1 text-sm text-gray-500">
            {notes.length} {notes.length === 1 ? "note" : "notes"} found
          </p>

          <div className="relative mt-4">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
              aria-hidden="true"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or content..."
              aria-label="Search notes"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </section>

        {/* Show an error if the API request fails */}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {/* Show a loading message */}
        {loading && <p className="mt-8 text-gray-600">Loading notes...</p>}

        {/* Show a message when there are no matching notes */}
        {!loading && !error && notes.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {searchTerm.trim() ? "No matching notes" : "No notes yet"}
            </h3>

            <p className="mt-2 text-gray-500">
              {searchTerm.trim()
                ? "Try a different keyword or clear the search."
                : "Create your first note using the form above."}
            </p>
          </div>
        )}

        {/* Display each note using NoteCard */}
        {!loading && !error && notes.length > 0 && (
          <section className="mt-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Home;
