import { configureStore } from '@reduxjs/toolkit';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// REDUCERS
import userReducer from './userSlice';

// const persistConfig = {
//   key: 'main-root',
//   version: 1,
//   storage,
// };

// const rootReducers = combineReducers({ user: userReducer });

// const persistedReducer = persistReducer(persistConfig, userReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

const store = configureStore({
  reducer: userReducer,
});

// const persistor = persistStore(store);

// export { persistor };
export default store;
