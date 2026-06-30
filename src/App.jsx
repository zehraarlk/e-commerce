import { useEffect } from 'react'
import './App.css'
import PageContainer from './container/PageContainer'
import Header from './components/Header'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RouterConfig from './config/RouterConfig'
import Loading from './components/Loading'
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux' 
import { calculateBasket, setDrawer, removeFromCartBackend, fetchCart } from './redux/slices/basketSlice' 
import { refreshFavorites } from './redux/slices/favoriteSlice'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const { products, drawer, totalAmount } = useSelector((store) => store.basket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Güncel kullanıcıyı LocalStorage'dan al
  const user = JSON.parse(localStorage.getItem('currentUser'));

  // 2. Kullanıcı değiştiğinde veya sayfa yüklendiğinde verileri çek
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.id));
      dispatch(refreshFavorites());
    }
  }, [dispatch, user?.id]); // User ID değiştikçe bu işlem tekrarlanır

  // 3. Sepet her güncellendiğinde toplam tutarı yeniden hesapla [cite: 1]
  useEffect(() => {
    dispatch(calculateBasket());
  }, [products, dispatch]);

  const handleConfirmBasket = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        toast.error("Siparişi onaylamak için giriş yapmalısın!");
        navigate("/login");
        return;
    }

    if (products.length === 0) {
        toast.warning("Sepetiniz boş!");
        return;
    }

    try {
        const payload = {
            user_id: user.id,
            total_price: totalAmount,
            product_details: products // Redux'taki sepet ürünleri
        };

        const response = await axios.post('http://localhost:5000/checkout', payload);
        
        if (response.status === 200) {
            toast.success("Siparişiniz başarıyla alındı!");
            dispatch(setDrawer()); // Drawer'ı kapat
            dispatch(fetchCart(user.id)); // Sepeti (artık boş olan) tekrar çek
            navigate("/orders"); // Siparişlerim sayfasına yönlendir
        }
    } catch (error) {
        toast.error("Sipariş oluşturulurken bir hata oluştu.");
    }
};

  return (
    <div>
      <PageContainer>
        <Header />
        <RouterConfig />
        <Loading />
        <Drawer 
          className='drawer' 
          sx={{ padding: '20px' }} 
          onClose={() => dispatch(setDrawer())} 
          anchor='right' 
          open={drawer} 
        >
          <div style={{ width: '450px', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', fontFamily: 'Poppins' }}>Sepetim</h2>
            <hr style={{ border: '0.5px solid #eee' }} />
            
            {products && products.map((product) => {
                const currentCount = product.quantity || 1;
                return (
                  <div key={product.id} className='flex-row' style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9' }}>
                    <img src={product.image} width={50} height={50} style={{ objectFit: 'contain', marginRight: '10px' }} />
                    <p style={{ width: '220px', fontSize: '14px', margin: '0 10px 0 0' }}>{product.title} ({currentCount})</p>
                    <p style={{ fontWeight: 'bold', width: '70px', color: '#b94c4c' }}>{(product.price * currentCount).toFixed(2)} TL</p>
                    <button 
                      onClick={() => dispatch(removeFromCartBackend({ userId: user.id, productId: product.id }))}
                      style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#b94c4c', border: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      sil
                    </button>
                  </div>
                )
            })}

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px' }}> 
                  Toplam Tutar: {totalAmount ? totalAmount.toFixed(2) : "0"} TL
              </p>
              <button onClick={handleConfirmBasket} className='add-basket-button' style={{ width: '100%' }}>
                Sepeti Onayla
              </button>
            </div>
          </div>
        </Drawer>
      </PageContainer>
      <ToastContainer autoClose={2000} position="bottom-right" />
    </div>
  )
}

export default App