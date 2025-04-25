// userActions.js

import axios from "axios";
import { toast } from "react-toastify";

// User Login Reducer
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = "LOGOUT";
// Creating New User
export const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";

const REACT_APP_API_URL = "http://147.93.106.185:3000";

// Action Creators
export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

// // Async login function
// export const login = (username, password) => async (dispatch) => {
//   dispatch(loginRequest());

//   try {
//     const response = await axios.post(`${REACT_APP_API_URL}/api/auth/login`, {
//       username,
//       password,
//     }).catch(err => {
//       toast.error('Login failed. Please try again.');
//     });

//     if (response.status === 200) {
//       const data = response.data;
//       localStorage.setItem('userData', JSON.stringify(data.data));
//       localStorage.setItem('userToken', data.data.token);
//       dispatch(loginSuccess(data.data?.user));
//       toast.success("Successfully Login")
//     } else if(response.status === 400 || response.status === 401) {
//       dispatch(loginFailure('Login failed. Please try again.'));
//       toast.error('Login failed. Please try again.');
//     }
//   } catch (error) {
//     // dispatch(loginFailure(error.response?.data?.message || 'Server error. Please try again later.'));
//     toast.error('Server error. Please try again later.');
//   }
// };

export const login = (username, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await axios.post(`${REACT_APP_API_URL}/api/auth/login`, {
      username,
      password,
    });

    if (response.status === 200) {
      const data = response.data;
      localStorage.setItem('userData', JSON.stringify(data.data));
      localStorage.setItem('userToken', data.data.token);
      dispatch(loginSuccess(data.data?.user));
      // toast.success("Successfully Logged In");
    }
  } catch (error) {
    let errorMessage = 'An unknown error occurred. Please try again.';

    // Axios returns response on error if it's a response issue (4xx, 5xx)
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
      // Request was made but no response received
      errorMessage = 'No response from server. Check your internet connection or try again later.';
    } else {
      // Something happened in setting up the request
      errorMessage = 'Failed to send request. Please try again.';
    }

    dispatch(loginFailure(errorMessage));
    toast.error(errorMessage);
  }
};


// Logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  toast.error('Logout Successfully.');

  dispatch({ type: LOGOUT });
};

export const createUser = (userData) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });

  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/CreateUser`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    if ([200, 201].includes(response.status)) {
      // toast.success(formData.userid ? "User updated!" : "User created!");
      toast.success("Successfully User Created")
    }

    dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: error?.response?.data?.message || "Something went wrong",
    });
    toast.error("Something went wrong. Try again.");
  }
};
