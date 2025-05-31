import {
  CREDIT_ACTION_START,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_STATS_SUCCESS,
  FETCH_TRANSFER_LOGS_SUCCESS,
  CREDIT_ACTION_FAILURE,
} from '../actions/transactionAction';

const initialState = {
  transfers: [],
  stats: {},
  logs: [],
  loading: false,
  error: '',
};

export const CreditsTransaction = (state = initialState, action) => {
  switch (action.type) {
    case CREDIT_ACTION_START:
      return { ...state, loading: true, error: '' };

    case FETCH_TRANSACTIONS_SUCCESS:
      return { ...state, loading: false, transfers: action.payload };

    case FETCH_STATS_SUCCESS:
      return { ...state, loading: false, stats: action.payload };

    case FETCH_TRANSFER_LOGS_SUCCESS:
      return { ...state, loading: false, logs: action.payload };

    case CREDIT_ACTION_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
