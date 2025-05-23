import axios from 'axios';
import {
    createTemplateStart, createTemplateSuccess, createTemplateFailure,
    getTemplatesStart, getTemplatesSuccess, getTemplatesFailure,
    approveTemplateStart, approveTemplateSuccess, approveTemplateFailure,
    rejectTemplateStart, rejectTemplateSuccess, rejectTemplateFailure,
    deleteTemplateStart, deleteTemplateSuccess, deleteTemplateFailure,
    getTemplateByIdStart, getTemplateByIdSuccess, getTemplateByIdFailure,
    updateTemplateStart, updateTemplateSuccess, updateTemplateFailure,
    fetchPendingTemplatesStart, fetchPendingTemplatesSuccess, fetchPendingTemplatesFailure,
} from '../reducer/templateReducer';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

// Dynamic headers with latest token
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getSecureItem('userToken')}`,
});

// Create Template
export const createTemplate = (templateFormData) => async (dispatch) => {
    dispatch(createTemplateStart());

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/templates`, templateFormData, { headers: getAuthHeaders() });

        dispatch(createTemplateSuccess(response.data));
        return { ok: true, data: response.data };
    } catch (error) {
        const errMsg = error?.response?.data?.message || "Failed to create template.";
        dispatch(createTemplateFailure(errMsg));
        return { ok: false, message: errMsg };
    }
};


// Get All Templates
export const getAllTemplates = () => async (dispatch) => {
    dispatch(getTemplatesStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates`, { headers: getAuthHeaders() });
        dispatch(getTemplatesSuccess(response.data.data));
    } catch (error) {
        dispatch(getTemplatesFailure(error.response?.data?.message || error.message));
    }
};

// Get Template by ID
export const getTemplateById = (templateId) => async (dispatch) => {
    dispatch(getTemplateByIdStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, { headers: getAuthHeaders() });
        dispatch(getTemplateByIdSuccess(response.data.data));
    } catch (error) {
        dispatch(getTemplateByIdFailure(error.response?.data?.message || error.message));
    }
};

// Update Template
export const updateTemplate = (templateId, templateData) => async (dispatch) => {
    dispatch(updateTemplateStart());
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, templateData, { headers: getAuthHeaders() });
        dispatch(updateTemplateSuccess(response.data));
    } catch (error) {
        dispatch(updateTemplateFailure(error.response?.data?.message || error.message));
    }
};

// Fetch Pending Templates
export const fetchPendingTemplates = () => async (dispatch) => {
    dispatch(fetchPendingTemplatesStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates/pending`, { headers: getAuthHeaders() });
        dispatch(fetchPendingTemplatesSuccess(response.data));
    } catch (error) {
        dispatch(fetchPendingTemplatesFailure(error.response?.data?.message || error.message));
    }
};

// Approve Template
export const approveTemplate = (templateId) => async (dispatch) => {
    dispatch(approveTemplateStart());
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}/approve`, {}, { headers: getAuthHeaders() });
        dispatch(approveTemplateSuccess(response.data.data));
    } catch (error) {
        dispatch(approveTemplateFailure(error.response?.data?.message || error.message));
    }
};

// Reject Template
export const rejectTemplate = (templateId, reason) => async (dispatch) => {
    dispatch(rejectTemplateStart());
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/templates/${templateId}/reject`,
            { reason },
            { headers: getAuthHeaders() }
        );
        dispatch(rejectTemplateSuccess(response.data.data));
    } catch (error) {
        dispatch(rejectTemplateFailure(error.response?.data?.message || error.message));
    }
};

// Delete Template
export const deleteTemplate = (templateId) => async (dispatch) => {
    dispatch(deleteTemplateStart());
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/templates/${templateId}`,
            { headers: getAuthHeaders() }
        );
        dispatch(deleteTemplateSuccess(response.data.data));
    } catch (error) {
        dispatch(deleteTemplateFailure(error.response?.data?.message || error.message));
    }
};
