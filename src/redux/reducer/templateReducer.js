import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templatesData: [],
  currentTemplate: null,
  loading: false,
  error: null,
  pendingTemplates: [],
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    // Create Template
    createTemplateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTemplateSuccess: (state, action) => {
      state.loading = false;
      state.templatesData.push(action.payload);
    },
    createTemplateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get All Templates
    getTemplatesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTemplatesSuccess: (state, action) => {
      state.loading = false;
      state.templatesData = action.payload;
    },
    getTemplatesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Template by ID
    getTemplateByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTemplateByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentTemplate = action.payload;
    },
    getTemplateByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Template
    updateTemplateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTemplateSuccess: (state, action) => {
      state.loading = false;
      // Update the template in templatesData array
      const index = state.templatesData.findIndex(t => t.id === action.payload.id || t._id === action.payload._id);
      if (index !== -1) {
        state.templatesData[index] = action.payload;
      }
      // If the currentTemplate is the one updated, update it as well
      if (state.currentTemplate && (state.currentTemplate.id === action.payload.id || state.currentTemplate._id === action.payload._id)) {
        state.currentTemplate = action.payload;
      }
    },
    updateTemplateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch Pending Templates
    fetchPendingTemplatesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPendingTemplatesSuccess: (state, action) => {
      state.loading = false;
      state.pendingTemplates = action.payload;
    },
    fetchPendingTemplatesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Approve
    approveTemplateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    approveTemplateSuccess: (state, action) => {
      state.loading = false;
      // You can update the approved template in templatesData if you want
      const index = state.templatesData.findIndex(t => t.id === action.payload.id || t._id === action.payload._id);
      if (index !== -1) {
        state.templatesData[index] = action.payload;
      }
    },
    approveTemplateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reject
    rejectTemplateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    rejectTemplateSuccess: (state, action) => {
      state.loading = false;
      // Optionally update templatesData with the rejected template info
      const index = state.templatesData.findIndex(t => t.id === action.payload.id || t._id === action.payload._id);
      if (index !== -1) {
        state.templatesData[index] = action.payload;
      }
    },
    rejectTemplateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deleteTemplateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteTemplateSuccess: (state, action) => {
      state.loading = false;
      state.templatesData = state.templatesData.filter(
        (template) => (template.id || template._id) !== (action.payload.id || action.payload._id)
      );
    },
    deleteTemplateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
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
  updateTemplateStart,
  updateTemplateSuccess,
  updateTemplateFailure,
  fetchPendingTemplatesStart,
  fetchPendingTemplatesSuccess,
  fetchPendingTemplatesFailure,
  approveTemplateStart,
  approveTemplateSuccess,
  approveTemplateFailure,
  rejectTemplateStart,
  rejectTemplateSuccess,
  rejectTemplateFailure,
  deleteTemplateStart,
  deleteTemplateSuccess,
  deleteTemplateFailure,
} = templateSlice.actions;

export const templateReducer = templateSlice.reducer;
