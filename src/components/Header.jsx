export default Header;
import React, { useState } from 'react'
import '../css/Header.css';
import { CiShoppingBasket, CiLight, CiSearch, CiHeart } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawer, clearBasket } from '../redux/slices/basketSlice'; // clearBasket eklendi
import { clearFavorites } from '../redux/slices/favoriteSlice'; // clearFavorites eklendi
import { filterProducts } from '../redux/slices/productSlice';
import { toast } from 'react-toastify';

function Header() {
    const [theme, setTheme] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
  
    const { products } = useSelector((store) => store.basket);
    const { favorites } = useSelector((store) => store.favorite);

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const changeTheme = () => {
        const root = document.getElementById("root");
        if (!theme) { // Tema false (açık) ise koyu yap
            root.style.backgroundColor = "black";
            root.style.color = "#fff";
        } else {
            root.style.backgroundColor = "#fff";
            root.style.color = "black";
        }
        setTheme(!theme);
    }

   
    const handleSearch = (e) => {
        dispatch(filterProducts(e.target.value));
    }

   const handleAuthAction = () => {
        if (isLoggedIn) {
            // ÇIKIŞ İŞLEMLERİ
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            
            // KRİTİK: Redux state'lerini sıfırla ki diğer kullanıcıya kalmasın
            dispatch(clearBasket());
            dispatch(clearFavorites());

            toast.success("Başarıyla çıkış yapıldı.");
            navigate('/login');
        } else {
            navigate('/login');
        }
    }


    return (
        <div className="header-container">
            {/* Logo Bölümü */}
            <div className='logo-section' onClick={() => navigate("/")}>
                <img className='logo' src="./src/images/logo.png" alt="Logo" />
                <p className='logo-text'>Zehra Aralık</p>
            </div>

            {/* Arama ve Sağ Taraf */}
            <div className='flex-row' style={{ gap: '20px' }}>
                
                {/* Hoş Geldin Mesajı (Sadece Giriş Yapılmışsa) */}
                {isLoggedIn && currentUser && (
                    <span style={{ fontWeight: '600', color: '#b94c4c', fontSize: '14px' }}>
                        Hoş geldin, {currentUser.username}
                    </span>
                )}

                {/* Arama Çubuğu */}
                <div className='flex-row' style={{ backgroundColor: '#f1f3f4', padding: '5px 15px', borderRadius: '20px' }}>
                    <CiSearch style={{ fontSize: '20px', color: '#f49696' }} />
                    <input 
                        className='search-input' 
                        type='text' 
                        placeholder='Ürünleri Keşfet' 
                        onChange={handleSearch}
                        style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', marginLeft: '10px' }}
                    />
                </div>

                {/* İkonlar ve Buton */}
                <div className='action-icons' style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    
                    {/* Tema Değiştirici */}
                    {theme ? 
                        <FaMoon className='icon' onClick={changeTheme} /> : 
                        <CiLight className='icon' onClick={changeTheme} />
                    }
                    
                    {/* Sadece Giriş Yapılmışsa Favori ve Sepet İkonları Görünsün */}
                    {isLoggedIn && (
                        <>
                            <Badge 
                                onClick={() => navigate("/favorites")}
                                badgeContent={favorites.length} 
                                color="error"
                                sx={{ '& .MuiBadge-badge': { backgroundColor: '#b94c4c', fontSize: '11px' } }}
                            >
                                <CiHeart className='icon' /> 
                            </Badge>

                            <Badge 
                                onClick={() => dispatch(setDrawer())} 
                                badgeContent={products.length} 
                                color="error"
                                sx={{ '& .MuiBadge-badge': { backgroundColor: '#b94c4c', fontSize: '11px' } }}
                            >
                                <CiShoppingBasket className='icon' />
                            </Badge>
                        </>
                    )}
                    

{isLoggedIn && currentUser?.username !== 'admin' && (
    <button 
        onClick={() => navigate("/orders")}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontWeight: '600', marginLeft: '15px' }}
    >
        Siparişlerim
    </button>
)}

                    {/* Giriş/Çıkış Butonu */}
                    <button 
                        onClick={handleAuthAction}
                        style={{
                            backgroundColor: isLoggedIn ? '#444' : 'transparent',
                            border: '1.5px solid #b94c4c',
                            color: isLoggedIn ? '#fff' : '#b94c4c',
                            padding: '5px 15px',
                            borderRadius: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginLeft: '10px',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isLoggedIn ? "Çıkış Yap" : "Giriş Yap"}
                    </button>
                    
                </div>
            </div>
        </div>
    )
}
