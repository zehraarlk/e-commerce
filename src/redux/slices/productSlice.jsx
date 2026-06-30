// src/redux/slices/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

export const getAllProducts = createAsyncThunk(
    "getAllProducts", 
    async () => {
        // BASE_URL'in "http://localhost:5000" olduğundan emin ol
        const response = await axios.get(`${BASE_URL}/products`);
        return response.data; // Backend res.json(rows) döndüğü için dizi buraya düşer
    }
);

const initialState = {
    products: [],          // API'den gelen ana liste
    filteredProducts: [],  // Ekranda gösterilecek olan (filtrelenmiş) liste
    selectedProduct: {},
    loading: false
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        // ARAMA FONKSİYONU BURADA
        filterProducts: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            state.filteredProducts = state.products.filter((product) =>
                product.title.toLowerCase().includes(searchTerm)
            );
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllProducts.pending, (state) => { // API çağrısı başladığında loading true yapılır
            state.loading = true;
        });
        builder.addCase(getAllProducts.fulfilled, (state, action) => { //veriler başarıyla geldiğinde loading false yapılır ve ürünler state'e kaydedilir
            state.loading = false;
            state.products = action.payload;
            state.filteredProducts = action.payload; // Başlangıçta ikisi de aynı olsun
        });
        builder.addCase(getAllProducts.rejected, (state) => { // API çağrısı başarısız olduğunda loading false yapılır
            state.loading = false;
        });
    }
});

export const { setSelectedProduct, filterProducts } = productSlice.actions;
export default productSlice.reducer;