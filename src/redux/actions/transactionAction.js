// actions/transactionAction.js
import axios from 'axios';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

// Action Types
export const CREDIT_ACTION_START = 'CREDIT_ACTION_START';
export const FETCH_TRANSACTIONS_SUCCESS = 'FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_STATS_SUCCESS = 'FETCH_STATS_SUCCESS';
export const FETCH_TRANSFER_LOGS_SUCCESS = 'FETCH_TRANSFER_LOGS_SUCCESS';
export const CREDIT_ACTION_FAILURE = 'CREDIT_ACTION_FAILURE';

// Headers with token
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getSecureItem('userToken')}`,
});

// Fetch credit transfers
export const handleCreditTransactions = (payload) => async (dispatch) => {
  dispatch({ type: CREDIT_ACTION_START });

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/credits/transfer`,
      payload,
      { headers: getAuthHeaders() }
    );

    dispatch({
      type: FETCH_TRANSACTIONS_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: CREDIT_ACTION_FAILURE,
      payload: error.response?.data?.message || 'Error fetching credit transfers',
    });
  }
};

// Fetch credit stats
export const fetchCreditStats = () => async (dispatch) => {
  dispatch({ type: CREDIT_ACTION_START });

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/credits/stats`,
      { headers: getAuthHeaders() }
    );

    dispatch({
      type: FETCH_STATS_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: CREDIT_ACTION_FAILURE,
      payload: error.response?.data?.message || 'Error fetching credit stats',
    });
  }
};

// Fetch credit transaction logs
export const fetchTransactionLogs = () => async (dispatch) => {
  dispatch({ type: CREDIT_ACTION_START });

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/credits/transactions`,
      { headers: getAuthHeaders() }
    );

    dispatch({
      type: FETCH_TRANSFER_LOGS_SUCCESS,
      payload: response.data.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: CREDIT_ACTION_FAILURE,
      payload: error.response?.data?.message || 'Error fetching transaction logs',
    });
  }
};
