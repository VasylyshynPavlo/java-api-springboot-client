import { configureStore } from '@reduxjs/toolkit';
import { categoriesApi } from '../services/categoriesApi';
import { productsApi } from '../services/productsApi';

export const store = configureStore({
    reducer: {
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(categoriesApi.middleware, productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
