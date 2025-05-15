import { createSlice } from '@reduxjs/toolkit';

// Initial state for the template slice
const initialState = {
  templates: [],
  template: null,
  loading: false,
  error: null,
  data: null,
};

const templateSlice = createSlice({
  name: 'template', // 👈 corrected from 'templateReducer' to 'template'
  initialState,
  reducers: {
    // Create Template
    createTemplateStart(state) {
      state.loading = true;
      state.error = null;
    },
    createTemplateSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    createTemplateFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Get All Templates
    getTemplatesStart(state) {
      state.loading = true;
      state.error = null;
    },
    getTemplatesSuccess(state, action) {
      state.loading = false;
      state.templates = action.payload;
    },
    getTemplatesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Template by ID
    getTemplateByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    getTemplateByIdSuccess(state, action) {
      state.loading = false;
      state.template = action.payload;
    },
    getTemplateByIdFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update the Template
    updateTemplateStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateTemplateSuccess(state, action) {
      state.loading = false;
      state.template = action.payload; // Updated template data
    },
    updateTemplateFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Pending Template
    getPendingTemplatesStart(state) {
      state.loading = true;
      state.error = null;
    },
    getPendingTemplatesSuccess(state, action) {
      state.loading = false;
      state.pendingTemplates = action.payload; // Store the pending templates
    },
    getPendingTemplatesFailure(state, action) {
      state.loading = false;
      state.error = action.payload; // Store any errors
    },

    // Approve Template
    approveTemplateStart(state) {
      state.loading = true;
      state.error = null;
    },
    approveTemplateSuccess(state, action) {
      state.loading = false;
      state.template = action.payload;
    },
    approveTemplateFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Reject Template
    rejectTemplateStart(state) {
      state.loading = true;
      state.error = null;
    },
    rejectTemplateSuccess(state, action) {
      state.loading = false;
      state.template = action.payload;
    },
    rejectTemplateFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete Template
    deleteTemplateStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteTemplateSuccess(state, action) {
      state.loading = false;
      state.templates = state.templates.filter(
        (template) => template._id !== action.payload._id
      );
    },
    deleteTemplateFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset State
    resetTemplateState() {
      return initialState;
    },
  },
});

export const {
  createTemplateStart,
  createTemplateSuccess,
  createTemplateFailure,

  getTemplatesStart,
  getTemplatesSuccess,
  getTemplatesFailure,

  getTemplateByIdStart,
  getTemplateByIdSuccess,
  getTemplateByIdFailure,

  getPendingTemplatesStart,
  getPendingTemplatesSuccess,
  getPendingTemplatesFailure,

  updateTemplateStart,
  updateTemplateSuccess,
  updateTemplateFailure,

  approveTemplateStart,
  approveTemplateSuccess,
  approveTemplateFailure,

  rejectTemplateStart,
  rejectTemplateSuccess,
  rejectTemplateFailure,

  deleteTemplateStart,
  deleteTemplateSuccess,
  deleteTemplateFailure,

  resetTemplateState,
} = templateSlice.actions;

export default templateSlice.reducer;
