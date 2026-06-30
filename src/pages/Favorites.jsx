import React from 'react'
import { useSelector } from 'react-redux'
import Product from '../components/Product'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackOutline } from "react-icons/io5"

function Favorites() {
    const navigate = useNavigate();
    const { favorites } = useSelector((store) => store.favorite); // tüm ürünler yerine Favori ürünleri Redux'tan alır

    return (
        <div style={{ marginTop: '40px' }}>
            {/* Üst Başlık ve Geri Dön */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div 
                    onClick={() => navigate("/")}  //ana sayfaya gider
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <IoArrowBackOutline size={25} />
                    <span style={{ fontWeight: '600' }}>Alışverişe Dön</span>
                </div>
                <h2 style={{ fontFamily: 'Poppins', margin: 0 }}>Favorilerim ({favorites.length})</h2>
            </div>

            {/* Favori Ürünler Listesi */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                justifyContent: 'flex-start', 
                gap: '25px' 
            }}>
                {
                    favorites.length > 0 ? ( //kaç adet favori ürün var
                        favorites.map((product) => (
                            <Product key={product.id} product={product} />
                        ))
                    ) : (
                        <div style={{ width: '100%', textAlign: 'center', marginTop: '50px' }}>
                            <p style={{ fontSize: '18px', color: '#666' }}>Henüz favori ürününüz bulunmuyor.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Favorites