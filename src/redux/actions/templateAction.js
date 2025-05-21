/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import {
    createTemplateStart, createTemplateSuccess, createTemplateFailure,
    getTemplatesStart, getTemplatesSuccess, getTemplatesFailure,
    approveTemplateStart, approveTemplateSuccess, approveTemplateFailure,
    rejectTemplateStart, rejectTemplateSuccess, rejectTemplateFailure,
    deleteTemplateStart, deleteTemplateSuccess, deleteTemplateFailure,
    getTemplateByIdStart, getTemplateByIdSuccess, getTemplateByIdFailure,
} from '../reducer/templateReducer';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

const authToken = getSecureItem('userToken');

// Headers Config
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
    // 'x-api-key': apiKey,
};

// Create Template
export const createTemplate = (templateData) => async (dispatch) => {
    dispatch(createTemplateStart());
    console.log("Re Created Template", templateData);
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/templates`,
            templateData,
            { headers },
        );
        console.log("Created Template", response);
        dispatch(createTemplateSuccess(response));
    } catch (error) {
        dispatch(createTemplateFailure(error.response?.data?.message || error.message));
    }
};

// Get All Templates
export const getAllTemplates = () => async (dispatch) => {
    dispatch(getTemplatesStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates`, { headers });
        dispatch(getTemplatesSuccess(response.data.data));
    } catch (error) {
        dispatch(getTemplatesFailure(error.response?.data?.message || error.message));
    }
};

// Get Template by ID
export const getTemplateById = (templateId) => async (dispatch) => {
    dispatch(getTemplateByIdStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, { headers });
        dispatch(getTemplateByIdSuccess(response.data.data));
    } catch (error) {
        dispatch(getTemplateByIdFailure(error.response?.data?.message || error.message));
    }
};

// Update Template
export const updateTemplate = async (templateId, templateData) => {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/api/templates/${templateId}`,
            templateData,
            { headers }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

// Fetch Pending Templates (Pure function – no dispatch)
export const fetchPendingTemplates = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates/pending`, { headers });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

// Approve Template
export const approveTemplate = (templateId) => async (dispatch) => {
    dispatch(approveTemplateStart());
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/templates/${templateId}/approve`,
            {},
            { headers }
        );
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
            { headers }
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
            { headers }
        );
        dispatch(deleteTemplateSuccess(response.data.data));
    } catch (error) {
        dispatch(deleteTemplateFailure(error.response?.data?.message || error.message));
    }
};
