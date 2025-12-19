import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { moviesApiSlice } from './api/moviesApiSlice';
import { tvApiSlice } from './api/tvApiSlice.ts';

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
        [moviesApiSlice.reducerPath]: moviesApiSlice.reducer,
        [tvApiSlice.reducerPath]: tvApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(moviesApiSlice.middleware).concat(tvApiSlice.middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
