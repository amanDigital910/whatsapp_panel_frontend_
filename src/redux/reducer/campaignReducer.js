import { CREATE_CAMPAIGN_FAILURE, CREATE_CAMPAIGN_REQUEST, CREATE_CAMPAIGN_SUCCESS, DELETE_CAMPAIGN_FAILURE, DELETE_CAMPAIGN_REQUEST, DELETE_CAMPAIGN_SUCCESS, GET_CAMPAIGNS_FAILURE, GET_CAMPAIGNS_REQUEST, GET_CAMPAIGNS_SUCCESS, UPDATE_CAMPAIGN_FAILURE, UPDATE_CAMPAIGN_REQUEST, UPDATE_CAMPAIGN_SUCCESS } from "../actions/campaignAction";

const initialState = {
  loading: false,
  campaigns: [],
  error: null,
};

export const campaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CAMPAIGN_REQUEST:
    case GET_CAMPAIGNS_REQUEST:
    case UPDATE_CAMPAIGN_REQUEST:
    case DELETE_CAMPAIGN_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loading: false,
        campaigns: [...state.campaigns, action.payload],
      };

    case GET_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        loading: false,
        campaigns: action.payload,
      };

    case UPDATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loading: false,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.payload.id ? action.payload : campaign
        ),
      };

    case DELETE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loading: false,
        campaigns: state.campaigns.filter((campaign) => campaign.id !== action.payload),
      };

    case CREATE_CAMPAIGN_FAILURE:
    case GET_CAMPAIGNS_FAILURE:
    case UPDATE_CAMPAIGN_FAILURE:
    case DELETE_CAMPAIGN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

// import { CREATE_CAMPAIGN_FAILURE, CREATE_CAMPAIGN_REQUEST, CREATE_CAMPAIGN_SUCCESS, DELETE_CAMPAIGN_FAILURE, DELETE_CAMPAIGN_REQUEST, DELETE_CAMPAIGN_SUCCESS, GET_CAMPAIGNS_FAILURE, GET_CAMPAIGNS_REQUEST, GET_CAMPAIGNS_SUCCESS, UPDATE_CAMPAIGN_FAILURE, UPDATE_CAMPAIGN_REQUEST, UPDATE_CAMPAIGN_SUCCESS } from "../actions/campaignAction";

// const initialState = {
//   loading: false,
//   campaigns: [],
//   error: null,
// };

// export const campaignReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case CREATE_CAMPAIGN_REQUEST:
//     case GET_CAMPAIGNS_REQUEST:
//     case UPDATE_CAMPAIGN_REQUEST:
//     case DELETE_CAMPAIGN_REQUEST:
//       return { ...state, loading: true, error: null };

//     case CREATE_CAMPAIGN_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         campaigns: [...state.campaigns, action.payload],
//       };

//     case GET_CAMPAIGNS_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         campaigns: Array.isArray(action.payload) ? action.payload : [],
//       };

//     case UPDATE_CAMPAIGN_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         campaigns: state.campaigns.map((campaign) =>
//           campaign.id === action.payload.id ? action.payload : campaign
//         ),
//       };

//     case DELETE_CAMPAIGN_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         campaigns: state.campaigns.filter((campaign) => campaign.id !== action.payload),
//       };

//     case CREATE_CAMPAIGN_FAILURE:
//     case GET_CAMPAIGNS_FAILURE:
//     case UPDATE_CAMPAIGN_FAILURE:
//     case DELETE_CAMPAIGN_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//       };

//     default:
//       return state;
//   }
// };
