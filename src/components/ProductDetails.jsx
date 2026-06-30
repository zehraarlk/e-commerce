import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom' // useNavigate eklendi
import { setSelectedProduct } from '../redux/slices/productSlice';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { IoArrowBackOutline } from "react-icons/io5"; // Geri oku ikonu
import { addToCartBackend, calculateBasket } from '../redux/slices/basketSlice';
import { toast } from 'react-toastify';
function ProductDetails() {
    const { id } = useParams(); // URL'den ürün ID'sini alır
    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 
    
    const { products, selectedProduct } = useSelector((store) => store.product)
    const { price, image, title, description } = selectedProduct; // Seçilen ürünün detaylarını alır

    const [count, setCount] = useState(1); // Ürün adedi için state

    const increment = () => setCount(count + 1);
    const decrement = () => count > 1 && setCount(count - 1); // Adet 1'den az olmasın

    const addBasket = () => {
    const payload = { id, price, image, title, description, count }; //ürün bilgileri 
    
    dispatch(addToCartBackend(payload)); // Ürünü sepete ekle
    dispatch(calculateBasket()); // Sepet tutarını güncelle
    
    toast.success("Ürün sepete eklendi!", {
        style: {
            fontSize: '14px',
            fontFamily: 'Arial'
        }
    });
}

    useEffect(() => {
        getProductById();  //ürünü buluyor
    }, [id])

    const getProductById = () => {
        products && products.forEach((product) => {
            if (product.id == id) { // ID'ye göre ürünü bulur ve kart detayına atar
                dispatch(setSelectedProduct(product));
            }
        })
    }

    return (
        <div className="details-container" style={{ position: 'relative', marginTop: '30px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {/* Geri Dön Butonu */}
            <div 
                onClick={() => navigate(-1)}  //bir önceki sayfaya gider
                style={{ position: 'absolute', top: '-10px', left: '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
                <IoArrowBackOutline size={25} />
                <span style={{ fontWeight: '600' }}>Geri Dön</span>
            </div>

            <div style={{ marginRight: '40px' }}>
                <img src={image} width={300} height={500} alt="" />
            </div>
            <div>
                <h1>{title}</h1>
                <p style={{ fontSize: '20px' }}>{description}</p>
                <h1 style={{ fontSize: '50px', color: 'rgb(185, 76, 76)' }}>{price}₺</h1>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CiCirclePlus onClick={increment} style={{ fontSize: '40px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '30px', margin: '0 15px' }}>{count}</span>
                    <CiCircleMinus onClick={decrement} style={{ fontSize: '40px', cursor: 'pointer' }} />
                </div>

                <button onClick={addBasket} className='add-basket-button'>Sepete Ekle</button>
            </div>
        </div>
    )
}

export default ProductDetails