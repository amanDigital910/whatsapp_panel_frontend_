// actions/groupAction.js
import axios from 'axios';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

// Action Types
export const GROUP_REQUEST_START = 'GROUP_REQUEST_START';
export const GROUP_REQUEST_FAILURE = 'GROUP_REQUEST_FAILURE';

export const CREATE_GROUP_SUCCESS = 'CREATE_GROUP_SUCCESS';
export const GET_GROUPS_SUCCESS = 'GET_GROUPS_SUCCESS';
export const GET_GROUP_BY_ID_SUCCESS = 'GET_GROUP_BY_ID_SUCCESS';
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS';
export const DELETE_GROUP_SUCCESS = 'DELETE_GROUP_SUCCESS';

// Headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getSecureItem('userToken')}`,
});

// Create Group
export const createGroup = (groupData) => async (dispatch) => {
  dispatch({ type: GROUP_REQUEST_START });

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/groups`, groupData, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: CREATE_GROUP_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: GROUP_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to create group' });
  }
};

// Get All Groups
export const getAllGroups = () => async (dispatch) => {
  dispatch({ type: GROUP_REQUEST_START });

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups`, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: GET_GROUPS_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: GROUP_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to fetch groups' });
  }
};

// Get Group by ID
export const getGroupById = (groupId) => async (dispatch) => {
  dispatch({ type: GROUP_REQUEST_START });

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups/${groupId}`, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: GET_GROUP_BY_ID_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: GROUP_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to fetch group' });
  }
};

// Update Group
export const updateGroup = (groupId, groupData) => async (dispatch) => {
  dispatch({ type: GROUP_REQUEST_START });

  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/groups/${groupId}`, groupData, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: UPDATE_GROUP_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: GROUP_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to update group' });
  }
};

// Delete Group
export const deleteGroup = (groupId) => async (dispatch) => {
  dispatch({ type: GROUP_REQUEST_START });

  try {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/groups/${groupId}`, {
      headers: getAuthHeaders(),
    });

    dispatch({ type: DELETE_GROUP_SUCCESS, payload: response.data.data });
    return response.data.data;
  } catch (error) {
    dispatch({ type: GROUP_REQUEST_FAILURE, payload: error.response?.data?.message || 'Failed to delete group' });
  }
};
