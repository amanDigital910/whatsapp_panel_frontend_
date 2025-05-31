import {
  GROUP_REQUEST_START,
  GROUP_REQUEST_FAILURE,
  CREATE_GROUP_SUCCESS,
  GET_GROUPS_SUCCESS,
  GET_GROUP_BY_ID_SUCCESS,
  UPDATE_GROUP_SUCCESS,
  DELETE_GROUP_SUCCESS,
} from '../actions/groupAction';

const initialState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
};

export const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case GROUP_REQUEST_START:
      return { ...state, loading: true, error: null };

    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: [...state.groups, action.payload],
      };

    case GET_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: action.payload,
      };

    case GET_GROUP_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentGroup: action.payload,
      };

    case UPDATE_GROUP_SUCCESS: {
      const updatedGroups = state.groups.map((g) =>
        (g.id || g._id) === (action.payload.id || action.payload._id)
          ? action.payload
          : g
      );
      return {
        ...state,
        loading: false,
        groups: updatedGroups,
        currentGroup:
          state.currentGroup &&
          (state.currentGroup.id === action.payload.id ||
            state.currentGroup._id === action.payload._id)
            ? action.payload
            : state.currentGroup,
      };
    }

    case DELETE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: state.groups.filter(
          (g) => (g.id || g._id) !== (action.payload.id || action.payload._id)
        ),
      };

    case GROUP_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
