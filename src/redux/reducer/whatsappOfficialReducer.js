// reducers/whatsappReducer.js
import { GET_WA_CONFIG_FAILURE, GET_WA_CONFIG_REQUEST, GET_WA_CONFIG_SUCCESS, SEND_WA_OFFICIAL_FAILURE, SEND_WA_OFFICIAL_REQUEST, SEND_WA_OFFICIAL_SUCCESS } from "../actions/WhatsappOfficialAction";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

const whatsappReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_WA_OFFICIAL_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case SEND_WA_OFFICIAL_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case SEND_WA_OFFICIAL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case GET_WA_CONFIG_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_WA_CONFIG_SUCCESS:
            return { ...state, loading: false, config: action.payload };

        case GET_WA_CONFIG_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default whatsappReducer;
