/* eslint-disable default-case */
import { LOGOUT, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, } from '../actions';
const loginInitialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: '',
    token: null,
};

const createUserInitialState = {
    loading: false,
    addNewUser: null,
    error: null,
};

export const loginReducer = (state = loginInitialState, action) => {
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
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                token: action.payload.token,
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

export const createUserReducer = (state = createUserInitialState, action) => {
    switch (action.type) {
        case CREATE_USER_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_USER_SUCCESS:
            return { ...state, loading: false, addNewUser: action.payload,  error: null };
        case CREATE_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};