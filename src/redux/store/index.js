// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createUserReducer, loginReducer } from '../reducer';
import { categoryCreateReducer } from '../reducer/categoryReducerTypes';

// Create the store with Redux Toolkit's configureStore method
const store = configureStore({
  reducer: {
    userLogin: loginReducer,
    userCreate: createUserReducer,
    categoryCreate: categoryCreateReducer,
  },
});

export default store;
