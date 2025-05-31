/* eslint-disable default-case */
import { LOGOUT, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAILURE, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE, UPDATE_USER_REQUEST, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE, FORCE_PASSWORD_RESET_REQUEST, FORCE_PASSWORD_RESET_SUCCESS, FORCE_PASSWORD_RESET_FAILURE, CHANGE_USER_PASSWORD_FAILURE, CHANGE_USER_PASSWORD_SUCCESS, CHANGE_USER_PASSWORD_REQUEST, UPLOAD_PROFILE_PICTURE_REQUEST, UPLOAD_PROFILE_PICTURE_SUCCESS, UPLOAD_PROFILE_PICTURE_FAILURE, } from '../actions/authAction';
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
    users: [],
    updatedUser: null,
    deletedUserId: null,
}

const changePwdInitialState = {
  changingPassword: false,
  changePasswordError: null,
  changePasswordMessage: null,
};

const uploadPicInitialState = {
  profileUploadLoading: false,
  profileUploadError: null,
  uploadedProfilePicture: null,
  user: {},
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

        // Get All Users
        case GET_USERS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload, error: null };
        case GET_USERS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Update User by ID
        case UPDATE_USER_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_USER_SUCCESS:
            return { ...state, loading: false, updatedUser: action.payload, error: null };
        case UPDATE_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Delete User by ID
        case DELETE_USER_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_USER_SUCCESS:
            return { ...state, loading: false, deletedUserId: action.payload, error: null };
        case DELETE_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const changePwdReducer = (state = changePwdInitialState, action) => {
    switch (action.type) {
        case CHANGE_USER_PASSWORD_REQUEST:
            return {
                ...state,
                changingPassword: true,
                changePasswordError: null,
                changePasswordMessage: null,
            };
        case CHANGE_USER_PASSWORD_SUCCESS:
            return {
                ...state,
                changingPassword: false,
                changePasswordMessage: action.payload,
            };
        case CHANGE_USER_PASSWORD_FAILURE:
            return {
                ...state,
                changingPassword: false,
                changePasswordError: action.payload,
            };
        default:
            return state;
    }
};

export const uploadProfilePicReducer = (state = uploadPicInitialState, action) => {
    switch (action.type) {
        case UPLOAD_PROFILE_PICTURE_REQUEST:
            return {
                ...state,
                profileUploadLoading: true,
                profileUploadError: null,
                uploadedProfilePicture: null,
            };
        case UPLOAD_PROFILE_PICTURE_SUCCESS:
            return {
                ...state,
                profileUploadLoading: false,
                uploadedProfilePicture: action.payload,
                user: {
                    ...state.user,
                    profilePicture: action.payload,
                },
            };
        case UPLOAD_PROFILE_PICTURE_FAILURE:
            return {
                ...state,
                profileUploadLoading: false,
                profileUploadError: action.payload,
            };
        default:
            return state;
    }
}