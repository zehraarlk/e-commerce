import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetails from '../components/ProductDetails';
import Favorites from '../pages/Favorites';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminPanel from '../pages/AdminPanel';
import Orders from '../pages/Orders';

// 1. Üye girişi kontrolü
const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return isLoggedIn ? children : <Navigate to="/login" />;
};

// 2. Admin yetkisi kontrolü (Bu mantık burada kalsın, ayrı dosyaya gerek yok)
const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // Kullanıcı adı 'admin' ise veya rolü 'admin' ise geçişe izin ver
    const isAdmin = user && (user.role === 'admin' || user.username === 'admin');
    
    return isAdmin ? children : <Navigate to="/" />;
};

function RouterConfig() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
            
            {/* Ürün detay yolu */}
            <Route path='/product-details/:id' element={<ProductDetails />} />
            
            {/* Favoriler (Sadece giriş yapanlar) */}
            <Route path='/favorites' element={
                <PrivateRoute>
                    <Favorites />
                </PrivateRoute>
            } />

            {/* ADMIN PANELİ (Sadece admin olanlar) */}
            <Route path='/admin' element={
                <AdminRoute>
                    <AdminPanel />
                </AdminRoute>
            } />
            
            {/* Yanlış URL girilirse ana sayfaya dön */}
            <Route path='*' element={<Navigate to="/" />} />
        </Routes>
    )
}

export default RouterConfig;