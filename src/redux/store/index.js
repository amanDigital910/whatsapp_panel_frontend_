// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createUserReducer, loginReducer, uploadProfilePicReducer, changePwdReducer } from '../reducer/authReducer';
import { templateReducer } from '../reducer/templateReducer';
import { categoryCreateReducer } from '../reducer/categoryReducerTypes';

// Create the store with Redux Toolkit's configureStore method
const store = configureStore({
  reducer: {
    userLogin: loginReducer,
    userCreate: createUserReducer,
    categoryCreate: categoryCreateReducer,
    template: templateReducer,
    passwordChange: changePwdReducer,
    uploadProfilePic: uploadProfilePicReducer,
  },
});

export default store;
