/* eslint-disable default-case */
import { LOGOUT, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, } from '../actions';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

const stored = JSON.parse(getSecureItem('userData'));
const storedToken = getSecureItem('userToken');
const loginInitialState = {
  user: stored?.user || null,
  token: storedToken || null,
  isAuthenticated: !!stored?.user,
  loading: false,
  error: '',
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
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
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
            return { ...state, loading: false, addNewUser: action.payload, error: null };
        case CREATE_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};