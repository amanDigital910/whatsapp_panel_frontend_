import {
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAILURE,
} from '../actions/categoryActionTypes';

const categoryInitialState = {
  loading: false,
  category: null,
  error: '',
};

export const categoryCreateReducer = (state = categoryInitialState, action) => {
  switch (action.type) {
    case CATEGORY_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case CATEGORY_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        category: action.payload,
        error: '',
      };
    case CATEGORY_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
