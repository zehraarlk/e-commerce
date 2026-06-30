import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../redux/slices/basketSlice';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });

            if (response.data.user) {
                const user = response.data.user;

                // 1. Kullanıcı bilgilerini yerel depolamaya kaydet
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));

                // 2. Kullanıcıya özel sepet verisini backend'den çek
                dispatch(fetchCart(user.id));

                toast.success(`Hoş geldin, ${user.username}!`);
                
               // handleLogin içindeki ilgili bölüm
if (response.data.user) {
    const user = response.data.user;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));

    dispatch(fetchCart(user.id));

    toast.success(`Hoş geldin, ${user.username}!`);
    
    setTimeout(() => {
        // BURAYI GÜNCELLEDİK:
        // Eğer kullanıcı adı 'admin' ise veya rolü 'admin' ise admin paneline git
        if (user.username === 'admin' || user.role === 'admin') {
            window.location.href = "/admin"; 
        } else {
            window.location.href = "/";
        }
    }, 1500);
}
            }
        } catch (err) {
            // Hata mesajını kullanıcıya göster
            toast.error(err.response?.data?.error || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
        }
    };
    return (
        <div className="flex-column" style={{ marginTop: '60px', minHeight: '70vh' }}>
            <div style={{ 
                background: '#fff', 
                padding: '40px', 
                borderRadius: '20px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                width: '350px' 
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#222', fontFamily: 'Poppins' }}>Giriş Yap</h2>
                
                <form onSubmit={handleLogin} className="flex-column" style={{ gap: '20px' }}>
                    <input
                        className='search-input'
                        style={{ width: '100%', border: '1px solid #eee', padding: '12px', borderRadius: '10px' }}
                        type="text"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className='search-input'
                        style={{ width: '100%', border: '1px solid #eee', padding: '12px', borderRadius: '10px' }}
                        type="password"
                        value={password}
                        placeholder="Şifre"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="add-basket-button" 
                        style={{ width: '100%', marginTop: '10px', cursor: 'pointer' }}
                    >
                        Giriş Yap
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    Hesabın yok mu? <span 
                        onClick={() => navigate('/register')} 
                        style={{ color: '#b94c4c', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Hemen Kayıt Ol
                    </span>
                </p>
            </div>
        </div>
    );
    
}

export default Login;