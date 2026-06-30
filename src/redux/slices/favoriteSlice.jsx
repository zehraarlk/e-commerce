import { createSlice } from '@reduxjs/toolkit'

// Yardımcı fonksiyon: Tarayıcıdan o kullanıcıya ait favorileri getirir
const getFavoritesFromStorage = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && localStorage.getItem(`favorites_${user.id}`)) {
        return JSON.parse(localStorage.getItem(`favorites_${user.id}`));
    }
    return [];
}

const initialState = {
    favorites: getFavoritesFromStorage(),
}

export const favoriteSlice = createSlice({ 
    name: "favorite", 
    initialState,
    reducers: {
        addToFavorites: (state, action) => {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) return;

            const findProduct = state.favorites.find((p) => p.id === action.payload.id);
            
            if (!findProduct) {
                // Favorilerde yoksa ekle
                state.favorites = [...state.favorites, action.payload];
            } else {
                // Varsa (tıklandığında) favorilerden çıkar
                state.favorites = state.favorites.filter((p) => p.id !== action.payload.id);
            }
            localStorage.setItem(`favorites_${user.id}`, JSON.stringify(state.favorites));
        },
        refreshFavorites: (state) => {
            state.favorites = getFavoritesFromStorage();
        },
        clearFavorites: (state) => {
            state.favorites = [];
        }
    }
})

export const { addToFavorites, refreshFavorites, clearFavorites } = favoriteSlice.actions
export default favoriteSlice.reducer