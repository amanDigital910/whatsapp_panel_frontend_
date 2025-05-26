// actions/transactionAction.js
import axios from 'axios';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

// Action Types
export const FETCH_USERS_START = 'FETCH_USERS_START';
export const FETCH_TRANSACTION_SUCCESS = 'FETCH_TRANSACTION_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const FETCH_LOGS_START = 'FETCH_LOGS_START';
export const FETCH_LOGS_SUCCESS = 'FETCH_LOGS_SUCCESS';
export const FETCH_LOGS_FAILURE = 'FETCH_LOGS_FAILURE';

// Dynamic headers function
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getSecureItem('userToken')}`,
});

// Fetch Credit Transactions
export const fetchCreditTransaction = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_USERS_START });

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/credits/transactions/user/${userId}`,
      { headers: getAuthHeaders() }
    );

    dispatch({
      type: FETCH_TRANSACTION_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: error.response?.data?.message || 'Error fetching users',
    });
  }
};

// Fetch Transaction Logs
export const fetchTransactionLogs = () => async (dispatch) => {
  dispatch({ type: FETCH_LOGS_START });

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/credits/transfer`,
      { headers: getAuthHeaders() }
    );

    dispatch({
      type: FETCH_LOGS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_LOGS_FAILURE,
      payload: error.response?.data?.message || 'Error fetching transaction logs',
    });
  }
};
