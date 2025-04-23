// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createUserReducer, loginReducer } from '../reducer';

// Create the store with Redux Toolkit's configureStore method
const store = configureStore({
  reducer: {
    loginReducer,
    userCreate: createUserReducer,
  },
});

export default store;
