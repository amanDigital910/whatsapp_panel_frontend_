// campaignActions.js

import axios from "axios";
import { getSecureItem } from "../../pages/utils/SecureLocalStorage";

// Action Types
export const CREATE_CAMPAIGN_REQUEST = "CREATE_CAMPAIGN_REQUEST";
export const CREATE_CAMPAIGN_SUCCESS = "CREATE_CAMPAIGN_SUCCESS";
export const CREATE_CAMPAIGN_FAILURE = "CREATE_CAMPAIGN_FAILURE";

export const GET_CAMPAIGNS_REQUEST = "GET_CAMPAIGNS_REQUEST";
export const GET_CAMPAIGNS_SUCCESS = "GET_CAMPAIGNS_SUCCESS";
export const GET_CAMPAIGNS_FAILURE = "GET_CAMPAIGNS_FAILURE";

export const UPDATE_CAMPAIGN_REQUEST = "UPDATE_CAMPAIGN_REQUEST";
export const UPDATE_CAMPAIGN_SUCCESS = "UPDATE_CAMPAIGN_SUCCESS";
export const UPDATE_CAMPAIGN_FAILURE = "UPDATE_CAMPAIGN_FAILURE";

export const DELETE_CAMPAIGN_REQUEST = "DELETE_CAMPAIGN_REQUEST";
export const DELETE_CAMPAIGN_SUCCESS = "DELETE_CAMPAIGN_SUCCESS";
export const DELETE_CAMPAIGN_FAILURE = "DELETE_CAMPAIGN_FAILURE";

export const GET_CAMPAIGN_BY_ID_REQUEST = "GET_CAMPAIGN_BY_ID_REQUEST";
export const GET_CAMPAIGN_BY_ID_SUCCESS = "GET_CAMPAIGN_BY_ID_SUCCESS";
export const GET_CAMPAIGN_BY_ID_FAILURE = "GET_CAMPAIGN_BY_ID_FAILURE";

// Action Creators

// Create
export const createCampaignRequest = () => ({ type: CREATE_CAMPAIGN_REQUEST });
export const createCampaignSuccess = (data) => ({ type: CREATE_CAMPAIGN_SUCCESS, payload: data });
export const createCampaignFailure = (error) => ({ type: CREATE_CAMPAIGN_FAILURE, payload: error });

// Read
export const getCampaignsRequest = () => ({ type: GET_CAMPAIGNS_REQUEST });
export const getCampaignsSuccess = (data) => ({ type: GET_CAMPAIGNS_SUCCESS, payload: data });
export const getCampaignsFailure = (error) => ({ type: GET_CAMPAIGNS_FAILURE, payload: error });

// Update
export const updateCampaignRequest = () => ({ type: UPDATE_CAMPAIGN_REQUEST });
export const updateCampaignSuccess = (data) => ({ type: UPDATE_CAMPAIGN_SUCCESS, payload: data });
export const updateCampaignFailure = (error) => ({ type: UPDATE_CAMPAIGN_FAILURE, payload: error });

// Delete
export const deleteCampaignRequest = () => ({ type: DELETE_CAMPAIGN_REQUEST });
export const deleteCampaignSuccess = (id) => ({ type: DELETE_CAMPAIGN_SUCCESS, payload: id });
export const deleteCampaignFailure = (error) => ({ type: DELETE_CAMPAIGN_FAILURE, payload: error });

export const getCampaignByIdRequest = () => ({ type: GET_CAMPAIGN_BY_ID_REQUEST });
export const getCampaignByIdSuccess = (data) => ({ type: GET_CAMPAIGN_BY_ID_SUCCESS, payload: data });
export const getCampaignByIdFailure = (error) => ({ type: GET_CAMPAIGN_BY_ID_FAILURE, payload: error });

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getSecureItem('userToken')}`,
});

export const handleCreateCampaign = (campaignData) => async (dispatch) => {
    dispatch(createCampaignRequest());

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/categories`, JSON.stringify(campaignData), {
            headers: getAuthHeaders(),
        });

        const data = await response?.data;

        if (data.success === true) {
            dispatch(createCampaignSuccess(data));
            return data;
        } else {
            dispatch(createCampaignFailure(data?.message || "Failed to create campaign"));
            return { success: false, message: data?.message || "Failed to create campaign" };
        }
    } catch (error) {
        dispatch(createCampaignFailure(error?.message || "Network error"));
        return { success: false, message: error?.message || "Network error" };
    }
};

export const handleGetCampaigns = () => async (dispatch) => {
    dispatch(getCampaignsRequest());

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, {
            headers: getAuthHeaders(),
        });

        const data = await response?.data?.data;

        dispatch(getCampaignsSuccess(data));
        return data
    } catch (error) {
        dispatch(getCampaignsFailure(error.message || "Failed to fetch campaigns"));
    }
};

export const handleUpdateCampaign = (id, updatedData) => async (dispatch) => {
    dispatch(updateCampaignRequest());

    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, JSON.stringify(updatedData), {
            headers: getAuthHeaders(),
        });
        const data = await response?.data;

        dispatch(updateCampaignSuccess(data));
        return data;
    } catch (error) {
        dispatch(updateCampaignFailure(error.message || "Failed to update campaign"));
    }
};

export const handleDeleteCampaign = (id) => async (dispatch) => {
    dispatch(deleteCampaignRequest());

    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, {
            headers: getAuthHeaders(),
        });
        const data = await response?.data;

        dispatch(deleteCampaignSuccess(id));
        return data;
    } catch (error) {
        dispatch(deleteCampaignFailure(error.message || "Failed to delete campaign"));
    }
};

export const handleGetCampaignById = (id) => async (dispatch) => {
    dispatch(getCampaignByIdRequest());

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, {
            headers: getAuthHeaders(),
        });

        dispatch(getCampaignByIdSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getCampaignByIdFailure(error.message || "Failed to fetch campaign by ID"));
    }
};
