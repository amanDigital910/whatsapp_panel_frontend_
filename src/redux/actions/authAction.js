import axios from "axios";
import { getSecureItem, removeSecureItem, setSecureItem } from "../../pages/utils/SecureLocalStorage";
import { toast } from "react-toastify";

// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = "LOGOUT";

export const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";

export const GET_USERS_REQUEST = "GET_USERS_REQUEST";
export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";
export const GET_USERS_FAILURE = "GET_USERS_FAILURE";

export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

export const DELETE_USER_REQUEST = "DELETE_USER_REQUEST";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
export const DELETE_USER_FAILURE = "DELETE_USER_FAILURE";

export const CHANGE_USER_PASSWORD_REQUEST = 'CHANGE_USER_PASSWORD_REQUEST';
export const CHANGE_USER_PASSWORD_SUCCESS = 'CHANGE_USER_PASSWORD_SUCCESS';
export const CHANGE_USER_PASSWORD_FAILURE = 'CHANGE_USER_PASSWORD_FAILURE';

export const UPLOAD_PROFILE_PICTURE_REQUEST = 'UPLOAD_PROFILE_PICTURE_REQUEST';
export const UPLOAD_PROFILE_PICTURE_SUCCESS = 'UPLOAD_PROFILE_PICTURE_SUCCESS';
export const UPLOAD_PROFILE_PICTURE_FAILURE = 'UPLOAD_PROFILE_PICTURE_FAILURE';

// Dynamic headers with latest token
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getSecureItem('userToken')}`,
});

const getMultiTypeHeaders = () => ({
  'Content-Type': 'multipart/form-data',
  Authorization: `Bearer ${getSecureItem('userToken')}`,
})

// Action Creators
export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (userData) => ({ type: LOGIN_SUCCESS, payload: userData });
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

// Async: Login
export const login = (username, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      username,
      password,
    });

    if (response?.status === 200) {
      const { user, token } = response.data.data;

      // Save to localStorage and secure storage
      localStorage.setItem('newUserToken', token);
      // localStorage.setItem('newUserData', JSON.stringify(response.data.data));
      setSecureItem('userData', JSON.stringify(user));
      setSecureItem('userToken', token);

      dispatch(loginSuccess(user));
      return user;
    }
  } catch (error) {
    let errorMessage = 'An unknown error occurred. Please try again.';

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 401) {
        errorMessage = data.message || 'Invalid Username or Password.';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = data.message || 'Login failed. Please try again.';
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Check your connection.';
    }

    dispatch(loginFailure(errorMessage));
    return { error: errorMessage };
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    removeSecureItem('userToken');
    removeSecureItem('userData');
    dispatch({ type: LOGOUT });
    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Create New User
export const createUser = (userData) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/CreateUser`,
      userData,
      { headers: getAuthHeaders() }
    );

    if ([200, 201].includes(response.status)) {
      dispatch({ type: CREATE_USER_SUCCESS, payload: response.data.data });
    }
    return response?.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create user");
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: error?.response?.data?.message || "Something went wrong",
    });
  }
};

// Get All Users
export const getAllUsers = () => async (dispatch) => {
  dispatch({ type: GET_USERS_REQUEST });
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/users`,
      { headers: getAuthHeaders() }
    );

    // if (response?.status === 200) {
    const filterSuperAdmins = response.data?.data.filter(user => user.role !== 'super_admin');
    // return superAdmins;      
    dispatch({ type: GET_USERS_SUCCESS, payload: filterSuperAdmins });

    return filterSuperAdmins;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch users");
    dispatch({
      type: GET_USERS_FAILURE,
      payload: error?.response?.data?.message || "Failed to fetch users",
    });
  }
};

// Update User
export const updateUser = (userId, updatedData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update-user/${userId}`,
      updatedData,
      { headers: getAuthHeaders() }
    );

    if (response?.status === 200) {
      dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
      toast.success("User successfully updated!");
    }
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to update user");
    dispatch({
      type: UPDATE_USER_FAILURE,
      payload: error?.response?.data?.message || "Failed to update user",
    });
  }
};

// Delete User
export const deleteUser = (userId) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/delete-user/${userId}`,
      { headers: getAuthHeaders() }
    );

    if (response?.status === 200) {
      dispatch({ type: DELETE_USER_SUCCESS, payload: userId });
      toast.success("User successfully deleted!");
    }
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to delete user");
    dispatch({
      type: DELETE_USER_FAILURE,
      payload: error?.response?.data?.message || "Failed to delete user",
    });
  }
};

export const changeUserPassword = (userId, payload) => async (dispatch) => {
  dispatch({ type: CHANGE_USER_PASSWORD_REQUEST });

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/admin/change-user-password/${userId}`,
      payload,
      { headers: getAuthHeaders() }
    );

    if (response?.status === 200) {
      dispatch({ type: CHANGE_USER_PASSWORD_SUCCESS, payload: response.data.message });
      toast.success(response.data.message || 'Password changed successfully');
    }
    return response?.data?.message;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || 'Failed to change user password';
    toast.error(errorMessage);
    dispatch({ type: CHANGE_USER_PASSWORD_FAILURE, payload: errorMessage });
  }
};

export const uploadProfilePicture = (file) => async (dispatch) => {
  dispatch({ type: UPLOAD_PROFILE_PICTURE_REQUEST });

  try {
    console.log("Data Files Founded", file);

    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/profile-picture`,
      file,
      { headers: getMultiTypeHeaders() });

    dispatch({
      type: UPLOAD_PROFILE_PICTURE_SUCCESS,
      payload: response.data?.data?.profilePicture, // contains the image path
    });
    return response.data?.data?.profilePicture;
  } catch (error) {
    dispatch({
      type: UPLOAD_PROFILE_PICTURE_FAILURE,
      payload: error.response?.data?.message || 'Failed to upload profile picture',
    });
  }
};