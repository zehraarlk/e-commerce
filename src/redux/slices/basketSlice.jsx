import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = "http://localhost:5000";

// Kullanıcı ID'sine göre sepeti backend'den çekiyoruz
export const fetchCart = createAsyncThunk("fetchCart", async (userId) => {
    const response = await axios.get(`${BASE_URL}/cart/${userId}`);
    return response.data; // Backend'den gelen: [{product_id, title, price, quantity...}]
});

// Ürünü kullanıcı ID'siyle backend'e kaydediyoruz
export const addToCartBackend = createAsyncThunk("addToCart", async ({ userId, product }) => {
    await axios.post(`${BASE_URL}/cart`, {
        user_id: userId,
        product_id: product.id,
        quantity: 1
    });
    return product;
});

// Silme işlemini kullanıcı ve ürün ID'siyle yapıyoruz
export const removeFromCartBackend = createAsyncThunk("removeFromCart", async ({ userId, productId }) => {
    await axios.delete(`${BASE_URL}/cart/${userId}/${productId}`);
    return productId;
});

const initialState = {
    products: [],
    drawer: false,
    totalAmount: 0,
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setDrawer: (state) => {
            state.drawer = !state.drawer;
        },
        calculateBasket: (state) => {
            let total = 0;
            state.products.forEach((product) => {
                const q = product.quantity || 1;
                total += product.price * q;
            });
            state.totalAmount = total;
        },
        clearBasket: (state) => {
            state.products = [];
            state.totalAmount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.products = action.payload;
            })
            .addCase(addToCartBackend.fulfilled, (state, action) => {
                const findProduct = state.products.find(p => p.id === action.payload.id);
                if (findProduct) {
                    findProduct.quantity = (findProduct.quantity || 1) + 1;
                } else {
                    state.products.push({ ...action.payload, quantity: 1 });
                }
            })
            .addCase(removeFromCartBackend.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p.id !== action.payload);
            });
    }
})

export const { setDrawer, calculateBasket, clearBasket } = basketSlice.actions
export default basketSlice.reducer