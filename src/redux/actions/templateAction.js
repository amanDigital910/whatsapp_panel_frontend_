/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import {
    createTemplateStart, createTemplateSuccess, createTemplateFailure,
    getTemplatesStart, getTemplatesSuccess, getTemplatesFailure,
    approveTemplateStart, approveTemplateSuccess, approveTemplateFailure,
    rejectTemplateStart, rejectTemplateSuccess, rejectTemplateFailure,
    deleteTemplateStart, deleteTemplateSuccess, deleteTemplateFailure,
    getTemplateByIdStart,
    getTemplateByIdSuccess,
    getTemplateByIdFailure,
} from '../reducer/templateReduce';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

const authToken = getSecureItem('userToken');

export const createTemplate = (templateData, ) => async (dispatch) => {
    dispatch(createTemplateStart());
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/templates`,
            templateData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    // 'x-api-key': apiKey,
                },
            }
        );
        console.log("Created Template",response);
        
        dispatch(createTemplateSuccess(response.data));
    } catch (error) {
        dispatch(createTemplateFailure(error.response?.data?.message || error.message));
    }
};

export const getAllTemplates = () => async (dispatch) => {
    dispatch(getTemplatesStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                // 'x-api-key': apiKey,
            },
        });
        console.log("Response of Get ALl Template",JSON.parse(response?.request?.response));
        
        dispatch(getTemplatesSuccess(response.data.data));
    } catch (error) {
        dispatch(getTemplatesFailure(error.response?.data?.message || error.message));
    }
};

export const getTemplateById = (templateId, ) => async (dispatch) => {
    dispatch(getTemplateByIdStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                // 'x-api-key': apiKey,
            },
        });
        dispatch(getTemplateByIdSuccess(response.data.data));
    } catch (error) {
        dispatch(getTemplateByIdFailure(error.response?.data?.message || error.message));
    }
};

// api/templateApi.js
export const updateTemplate = async (templateId, templateData, ) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            // 'x-api-key': apiKey,
        },
        body: JSON.stringify(templateData),
    });

    if (!response.ok) {
        throw new Error('Failed to update template');
    }

    return await response.json();
};

// Fetching Pending Template
export const fetchPendingTemplates = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/templates/pending`, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            // 'x-api-key': apiKey,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch pending templates');
    }

    return await response.json();
};

export const approveTemplate = async ({ templateId,  }) => async (dispatch) => {

    try {
        dispatch(approveTemplateStart());

        // Make the API call to approve the template
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}/approve`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                // 'x-api-key': apiKey,
            },
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(approveTemplateSuccess(data.data));
        } else {
            const error = await response.json();
            dispatch(approveTemplateFailure(error.message));
        }
    } catch (error) {
        dispatch(approveTemplateFailure(error.toString()));
    }
};

export const rejectTemplate = async (templateId, reason, ) => async (dispatch) => {

    try {
        dispatch(rejectTemplateStart());

        // Make the API call to reject the template
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}/reject`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                // 'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reason, // The reason for rejection
            }),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(rejectTemplateSuccess(data.data)); // Dispatch the updated template after rejection
        } else {
            const error = await response.json();
            dispatch(rejectTemplateFailure(error.message)); // Dispatch failure if the request fails
        }
    } catch (error) {
        dispatch(rejectTemplateFailure(error.toString())); // Handle unexpected errors
    }
};

export const deleteTemplate = ({ templateId,  }) => async (dispatch) => {

    try {
        dispatch(deleteTemplateStart());

        // Make the API call to delete the template
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                // 'x-api-key': apiKey,
            },
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(deleteTemplateSuccess(data.data));
        } else {
            const error = await response.json();
            dispatch(deleteTemplateFailure(error.message));
        }
    } catch (error) {
        dispatch(deleteTemplateFailure(error.toString()));
    }
};
