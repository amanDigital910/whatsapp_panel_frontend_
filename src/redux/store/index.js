// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createUserReducer, loginReducer, uploadProfilePicReducer, changePwdReducer } from '../reducer/authReducer';
import { templateReducer } from '../reducer/templateReducer';
import { CreditsTransaction } from '../reducer/transactionReducer';

// Create the store with Redux Toolkit's configureStore method
const store = configureStore({
  reducer: {
    userLogin: loginReducer,
    userCreate: createUserReducer,
    creditsTransaction: CreditsTransaction,
    template: templateReducer,
    passwordChange: changePwdReducer,
    uploadProfilePic: uploadProfilePicReducer,
  },
});

export default store;
