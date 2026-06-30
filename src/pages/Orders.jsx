import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/orders/${user.id}`)
                .then(res => setOrders(res.data))
                .catch(err => console.error("Siparişler çekilemedi:", err));
        }
    }, [user?.id]);

    return (
        <div style={{ marginTop: '40px', padding: '0 20px' }}>
            <div onClick={() => navigate("/")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
                <IoArrowBackOutline size={25} />
                <span style={{ fontWeight: '600' }}>Alışverişe Dön</span>
            </div>
            
            <h2 style={{ marginBottom: '30px' }}>Siparişlerim ({orders.length})</h2>

            {orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px', marginBottom: '15px' }}>
                                <strong>Sipariş No: #{order.id}</strong>
                                <span style={{ 
                                    padding: '5px 12px', 
                                    borderRadius: '20px', 
                                    backgroundColor: order.status === 'Hazırlanıyor' ? '#fff3cd' : '#d1e7dd',
                                    color: order.status === 'Hazırlanıyor' ? '#856404' : '#0f5132',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    {order.status}
                                </span>
                            </div>
                            <p style={{ fontSize: '14px', color: '#666' }}>Tarih: {new Date(order.order_date).toLocaleDateString('tr-TR')}</p>
                            <p style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>Toplam: {order.total_price.toFixed(2)} TL</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Henüz bir siparişiniz bulunmuyor.</p>
            )}
        </div>
    );
}

export default Orders;