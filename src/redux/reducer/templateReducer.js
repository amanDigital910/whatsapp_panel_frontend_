import {
  CREATE_TEMPLATE_SUCCESS,
  GET_TEMPLATES_SUCCESS,
  GET_TEMPLATE_BY_ID_SUCCESS,
  UPDATE_TEMPLATE_SUCCESS,
  DELETE_TEMPLATE_SUCCESS,
  TEMPLATE_REQUEST_START,
  TEMPLATE_REQUEST_FAILURE,
  FETCH_PENDING_TEMPLATES_SUCCESS,
  APPROVE_TEMPLATE_SUCCESS,
  REJECT_TEMPLATE_SUCCESS,
} from '../actions/templateAction';

const initialState = {
  templatesData: [],
  currentTemplate: null,
  loading: false,
  error: null,
  pendingTemplates: [],
};

export const templateReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEMPLATE_REQUEST_START:
      return { ...state, loading: true, error: null };

    case CREATE_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        templatesData: [...state.templatesData, action.payload],
      };

    case GET_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        templatesData: action.payload,
      };

    case GET_TEMPLATE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentTemplate: action.payload,
      };

    case UPDATE_TEMPLATE_SUCCESS: {
      const updatedTemplates = state.templatesData.map((t) =>
        (t.id || t._id) === (action.payload.id || action.payload._id)
          ? action.payload
          : t
      );
      return {
        ...state,
        loading: false,
        templatesData: updatedTemplates,
        currentTemplate:
          state.currentTemplate &&
          (state.currentTemplate.id === action.payload.id ||
            state.currentTemplate._id === action.payload._id)
            ? action.payload
            : state.currentTemplate,
      };
    }

    case DELETE_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        templatesData: state.templatesData.filter(
          (t) => (t.id || t._id) !== (action.payload.id || action.payload._id)
        ),
      };

    case FETCH_PENDING_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingTemplates: action.payload,
      };

    case APPROVE_TEMPLATE_SUCCESS:
    case REJECT_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        templatesData: state.templatesData.map((t) =>
          (t.id || t._id) === (action.payload.id || action.payload._id)
            ? action.payload
            : t
        ),
      };

    case TEMPLATE_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
