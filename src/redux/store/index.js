// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createUserReducer, loginReducer } from '../reducer/authReducer';
import templateReducer  from '../reducer/templateReduce';
import { categoryCreateReducer } from '../reducer/categoryReducerTypes';

// Create the store with Redux Toolkit's configureStore method
const store = configureStore({
  reducer: {
    userLogin: loginReducer,
    userCreate: createUserReducer,
    categoryCreate: categoryCreateReducer,
    template: templateReducer,
  },
});

export default store;
