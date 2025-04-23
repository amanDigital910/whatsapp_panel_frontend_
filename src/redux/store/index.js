// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducer';

// Create the store with Redux Toolkit's configureStore method
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
