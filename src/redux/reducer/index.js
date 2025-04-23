import { LOGOUT, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: '',
    token: null, // You may want to store the token here
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: '',
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,   // Assuming payload contains user data
                isAuthenticated: true,
                loading: false,
                token: action.payload.token, // Store token if returned
                error: '',
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                token: null,
                error: '',
            };
        default:
            return state;
    }
};

export default userReducer;
