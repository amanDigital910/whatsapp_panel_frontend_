// reducers/CreditsTransactionReducer.js
import {
  FETCH_USERS_START,
  FETCH_LOGS_START,
  FETCH_LOGS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_LOGS_FAILURE,
  FETCH_TRANSACTION_SUCCESS,
} from '../actions/transactionAction';

const initialState = {
  userList: [],
  transactionsLogs: [],
  loading: false,
  error: '',
};

export const CreditsTransaction = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_START:
    case FETCH_LOGS_START:
      return { ...state, loading: true, error: '' };

    case FETCH_TRANSACTION_SUCCESS:
      return { ...state, loading: false, userList: action.payload };

    case FETCH_LOGS_SUCCESS:
      return { ...state, loading: false, transactionsLogs: action.payload };

    case FETCH_USERS_FAILURE:
    case FETCH_LOGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
