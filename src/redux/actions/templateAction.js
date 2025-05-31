// actions/templateAction.js
import axios from 'axios';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

// Action Types
export const TEMPLATE_REQUEST_START = 'TEMPLATE_REQUEST_START';
export const TEMPLATE_REQUEST_FAILURE = 'TEMPLATE_REQUEST_FAILURE';

export const CREATE_TEMPLATE_SUCCESS = 'CREATE_TEMPLATE_SUCCESS';
export const GET_TEMPLATES_SUCCESS = 'GET_TEMPLATES_SUCCESS';
export const GET_TEMPLATE_BY_ID_SUCCESS = 'GET_TEMPLATE_BY_ID_SUCCESS';
export const UPDATE_TEMPLATE_SUCCESS = 'UPDATE_TEMPLATE_SUCCESS';
export const DELETE_TEMPLATE_SUCCESS = 'DELETE_TEMPLATE_SUCCESS';
export const FETCH_PENDING_TEMPLATES_SUCCESS = 'FETCH_PENDING_TEMPLATES_SUCCESS';

export const APPROVE_TEMPLATE_SUCCESS = 'APPROVE_TEMPLATE_SUCCESS';
export const REJECT_TEMPLATE_SUCCESS = 'REJECT_TEMPLATE_SUCCESS';

// Headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getSecureItem('userToken')}`,
});

// Create Template
export const createTemplate = (templateData) => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/templates`, templateData, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: CREATE_TEMPLATE_SUCCESS, payload: response.data.data });

    return response.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to create template' });
  }
};

// Get All Templates
export const getAllTemplates = () => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates`, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: GET_TEMPLATES_SUCCESS, payload: response.data.data });
    
    return response.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to fetch templates' });
  }
};

// Get Template by ID
export const getTemplateById = (templateId) => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: GET_TEMPLATE_BY_ID_SUCCESS, payload: response.data.data });
    return response.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to fetch template' });
  }
};

// Update Template
export const updateTemplate = (templateId, templateData) => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, templateData, { headers: getAuthHeaders() });
    dispatch({ type: UPDATE_TEMPLATE_SUCCESS, payload: response.data.data });
    return response.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to update template' });
  }
};

// Delete Template
export const deleteTemplate = (templateId) => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, {
      headers: getAuthHeaders(),
    });

    console.log("Response Data Delete Template Success",response.data);
    
    dispatch({ type: DELETE_TEMPLATE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to delete template' });
  }
};

// Fetch Pending Templates
export const fetchPendingTemplates = () => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates/pending`, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: FETCH_PENDING_TEMPLATES_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to fetch pending templates' });
  }
};

// Approve Template
export const approveTemplate = (templateId) => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}/approve`, {}, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: APPROVE_TEMPLATE_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to approve template' });
  }
};

// Reject Template
export const rejectTemplate = (templateId) => async (dispatch) => {
  dispatch({ type: TEMPLATE_REQUEST_START });

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}/reject`, {}, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: REJECT_TEMPLATE_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: TEMPLATE_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to reject template' });
  }
};
