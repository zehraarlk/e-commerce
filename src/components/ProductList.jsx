import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../redux/slices/productSlice';
import Product from './Product';
import Skeleton from '@mui/material/Skeleton';

function ProductList() {
    const dispatch = useDispatch();
    
    // filteredProducts'ı çekiyoruz ki arama yapınca liste güncellensin
    const { filteredProducts, loading } = useSelector((store) => store.product);

    useEffect(() => {
        dispatch(getAllProducts())
    }, [dispatch])

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'center', // Kartları ortalar
            gap: '25px',              // Kartlar arası boşluk
            marginTop: '40px' 
        }}>
            {
                loading ? ( //veriler gelene kadar skeleton gösterir
                    Array.from(new Array(8)).map((_, index) => (
                        <div key={index} style={{ width: '200px', margin: '15px' }}>
                            <Skeleton variant="rectangular" width={200} height={240} sx={{ borderRadius: '10px' }} />
                            <Skeleton variant="text" width="100%" height={40} sx={{ marginTop: '10px' }} />
                            <Skeleton variant="text" width="60%" height={30} sx={{ margin: '0 auto' }} />
                            <Skeleton variant="rounded" width="100%" height={40} sx={{ marginTop: '15px' }} />
                        </div>
                    ))
                ) : (
                    filteredProducts && filteredProducts.map((product) => (
                        <Product key={product.id} product={product} />
                    )) //veriler geldikten sonra ürünleri listeler
                )
            }
        </div>
    )
}

export default ProductList