import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templatesData: [],
  currentTemplate: null,
  loading: false,
  error: null,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    // Create Template
    createTemplateStart: (state) => {
      state.loading = true;
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
    },
    getTemplateByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentTemplate = action.payload;
    },
    getTemplateByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Approve
    approveTemplateStart: (state) => {
      state.loading = true;
    },
    approveTemplateSuccess: (state, action) => {
      state.loading = false;
      // handle approved data
    },
    approveTemplateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reject
    rejectTemplateStart: (state) => {
      state.loading = true;
    },
    rejectTemplateSuccess: (state, action) => {
      state.loading = false;
      // handle rejected data
    },
    rejectTemplateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deleteTemplateStart: (state) => {
      state.loading = true;
    },
    deleteTemplateSuccess: (state, action) => {
      state.loading = false;
      state.templatesData = state.templatesData.filter(
        (template) => template.id !== action.payload.id
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
