import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { moviesApiSlice } from './api/moviesApiSlice';

// const persistConfig = {
//     key: 'root',
//     storage,
//     version: 1
// };

// const persistedReducer = persistReducer(
//     persistConfig,
//     rootReducer
// );

export const store = configureStore({
    reducer: {
        // persisted: persistedReducer,
        [moviesApiSlice.reducerPath]: moviesApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false // required for redux-persist
        }).concat(moviesApiSlice.middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
