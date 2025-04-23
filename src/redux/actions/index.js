// userActions.js

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = "LOGOUT";

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

// Async login function
export const login = (username, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await fetch(`http://147.93.106.185:3000/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      dispatch(loginFailure(data?.message || 'Failed to login.'));
      return;
    }

    if (data?.message === 'Invalid credentials') {
      dispatch(loginFailure('Invalid credentials'));
    } else if (data?.message === 'Login successful') {
      // Store token and user info
      localStorage.setItem('userData', JSON.stringify(data?.data));
      localStorage.setItem('userToken', data?.data?.token);

      dispatch(loginSuccess(data?.data));
    } else {
      dispatch(loginFailure('Something went wrong, please try again.'));
    }
  } catch (error) {
    dispatch(loginFailure('Server error. Please try again later.'));
  }
};

// Logout action
export const logout = (dispatch) => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');

  dispatch({ type: LOGOUT });
};
