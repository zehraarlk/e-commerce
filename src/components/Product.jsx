import React from 'react'
import '../css/Product.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { addToCartBackend, calculateBasket } from '../redux/slices/basketSlice'; 
import { addToFavorites } from '../redux/slices/favoriteSlice';
import { FaRegHeart, FaHeart } from "react-icons/fa";

function Product({ product }) {
    const { id, price, image, title, description } = product;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Kullanıcıyı fonksiyonun İÇİNDE alıyoruz
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // 2. Favori kontrolü
    const { favorites } = useSelector((store) => store.favorite);
    const isFavorite = favorites && favorites.find((f) => f.id === id);

    // 3. Sepete ekleme fonksiyonu (Daha temiz yönetim için)
    const handleAddBasket = (e) => {
        e.stopPropagation(); // Karta tıklayıp detay sayfasına gitmesini engeller
        if (user) {
            // Backend fonksiyonuna userId ve product paketini gönderiyoruz
            dispatch(addToCartBackend({ userId: user.id, product: product }));
            dispatch(calculateBasket());
        } else {
            alert("Lütfen önce giriş yapın!");
        }
    };

    return (
        <div className='card' style={{ position: 'relative' }} onClick={() => navigate("/product-details/" + id)}>
            
            {/* Kalp İkonu */}
            <div 
                style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    right: '15px', 
                    zIndex: '10', 
                    cursor: 'pointer' 
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToFavorites(product));
                }}
            >
                {isFavorite ? 
                    <FaHeart style={{ color: '#b94c4c', fontSize: '24px' }} /> : 
                    <FaRegHeart style={{ fontSize: '24px', color: '#444' }} />
                }
            </div>

            <img className='image' src={image} alt={title} />
            
            <div>
                <p className='title-text'>{title}</p>
                <h3 className='price-text'>{price}₺</h3>
            </div>

            <div className='product-card-buttons'>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/product-details/" + id);
                    }} 
                    className='action-btn btn-detail'
                >
                    İncele
                </button>
                
                <button 
                    onClick={handleAddBasket} // Yukarıda tanımladığımız fonksiyonu çağırdık
                    className='action-btn btn-add'
                >
                    Sepete Ekle
                </button>
            </div>
        </div>
    )
}

export default Product