import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: "note",
  initialState,

  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },

    addNote: (state, action) => {
      state.notes.unshift(action.payload);
    },

    updateNote: (state, action) => {
      const updatedNote = action.payload;

      state.notes = state.notes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note,
      );
    },

    deleteNote: (state, action) => {
      state.notes = state.notes.filter((note) => note._id !== action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;

      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  setLoading,
  setError,
} = noteSlice.actions;

export default noteSlice.reducer;
