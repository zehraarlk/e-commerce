import { configureStore } from '@reduxjs/toolkit'
import appReducer from '../redux/slices/appSlice';
import productReducer from '../redux/slices/productSlice';
import basketReducer from '../redux/slices/basketSlice';
import favoriteReducer from '../redux/slices/favoriteSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        product: productReducer,
        basket: basketReducer,
        favorite: favoriteReducer
    },
})