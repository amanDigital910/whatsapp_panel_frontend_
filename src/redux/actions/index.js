import axios from "axios";
import { getSecureItem, removeSecureItem, setSecureItem } from "../../pages/utils/SecureLocalStorage";


// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = "LOGOUT";

// Creating New User
export const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";

// const REACT_APP_API_URL = "http://147.93.106.185:3000";

// Action Creators
export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (userData) => ({ type: LOGIN_SUCCESS, payload: userData });
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });


// Async login function
export const login = (username, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      username,
      password,
    });

    if (response.status === 200) {
      const userData = response?.data?.data;
      const { user, token, } = userData;

      setSecureItem('userData', JSON.stringify(user));
      setSecureItem('userToken', token);

      // Set a session cookie with the encrypted token
      setAuthCookies(user, token);
      dispatch(loginSuccess({ user, token }));

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
      errorMessage = 'No response from server. Check your connection.';
    } else {
      // Something happened in setting up the request
      errorMessage = 'Failed to send request. Please try again.';
    }

    dispatch(loginFailure(errorMessage));
    return { error: errorMessage };
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    // const encryptToken = Cookies.get("userToken");
    // const userToken = decryptData(encryptToken);
    // console.log(userToken);

    // // toast.error('Logout Successfully.');
    // await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {},
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userToken}`,
    //     },
    //   }
    // );

    removeSecureItem('userToken');
    removeSecureItem('userData');
    dispatch({ type: LOGOUT });
  }
  catch (error) {
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: error?.response?.data?.message || "Something went wrong",
    });
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
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getSecureItem("userToken")}`,
        },
      }
    );

    if ([200, 201].includes(response.status)) {
      dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });
    }
  } catch (error) {
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: error?.response?.data?.message || "Something went wrong",
    });
    console.log("Something went wrong. Try again.", error);
  }
};
