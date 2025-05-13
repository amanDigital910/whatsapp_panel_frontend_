// redux/actionTypes/categoryActionTypes.js
import axios from 'axios';
import { getSecureItem } from '../../pages/utils/SecureLocalStorage';

export const CATEGORY_CREATE_REQUEST = 'CATEGORY_CREATE_REQUEST';
export const CATEGORY_CREATE_SUCCESS = 'CATEGORY_CREATE_SUCCESS';
export const CATEGORY_CREATE_FAILURE = 'CATEGORY_CREATE_FAILURE';

export const createCreditCategory = (categoryData, token) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_CREATE_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getSecureItem("userToken")}`,
      },
    };

    const response = await axios.post('http://147.93.106.185:3000/categories',
      categoryData,
      config
    );

    dispatch({
      type: CATEGORY_CREATE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_CREATE_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
