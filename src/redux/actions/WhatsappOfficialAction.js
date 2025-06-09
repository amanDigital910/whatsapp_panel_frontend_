// actions/whatsappActions.js
import axios from 'axios';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

export const SEND_WA_OFFICIAL_REQUEST = 'SEND_WA_OFFICIAL_REQUEST';
export const SEND_WA_OFFICIAL_SUCCESS = 'SEND_WA_OFFICIAL_SUCCESS';
export const SEND_WA_OFFICIAL_FAILURE = 'SEND_WA_OFFICIAL_FAILURE';

export const GET_WA_CONFIG_REQUEST = 'GET_WA_CONFIG_REQUEST';
export const GET_WA_CONFIG_SUCCESS = 'GET_WA_CONFIG_SUCCESS';
export const GET_WA_CONFIG_FAILURE = 'GET_WA_CONFIG_FAILURE';


// Headers with token
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getSecureItem('userToken')}`,
});

export const sendWhatsAppMessage = (payload) => {
    return async (dispatch) => {
        dispatch({ type: SEND_WA_OFFICIAL_REQUEST });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}api/whatsapp/configure`,
                payload,
                { headers: getAuthHeaders() }
            );

            dispatch({
                type: SEND_WA_OFFICIAL_SUCCESS,
                payload: response.data,
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: SEND_WA_OFFICIAL_FAILURE,
                payload: error.response?.data || error.message,
            });
        }
    };
};


export const getWhatsAppConfig = () => {
    return async (dispatch) => {
        dispatch({ type: GET_WA_CONFIG_REQUEST });

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/whatsapp/config`,
                { headers: getAuthHeaders() }
            );

            dispatch({
                type: GET_WA_CONFIG_SUCCESS,
                payload: response.data,
            });

            return response.data;
        } catch (error) {
            dispatch({
                type: GET_WA_CONFIG_FAILURE,
                payload: error.response?.data?.message || error.message,
            });
        }
    };
};