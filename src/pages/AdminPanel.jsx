import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]); // Kullanıcılar için yeni state
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0, categories: [] });
    
    // Kategori filtresi için state'ler
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);

    const [productForm, setProductForm] = useState({
        title: '', price: '', description: '', category: '', image: ''
    });

    const fetchData = async () => {
        try {
            const [prodRes, orderRes, statRes, userRes] = await Promise.all([
                axios.get('http://localhost:5000/products'),
                axios.get('http://localhost:5000/admin/orders'),
                axios.get('http://localhost:5000/admin/stats'),
                axios.get('http://localhost:5000/admin/users') // Backend'e eklediğimiz yeni yol
            ]);
            setProducts(prodRes.data);
            setOrders(orderRes.data);
            setStats(statRes.data);
            setUsers(userRes.data);
        } catch (error) {
            console.error("Veriler çekilemedi:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Kategoriye tıklandığında ürünleri getiren fonksiyon
    const handleCategoryClick = async (categoryName) => {
        try {
            const res = await axios.get(`http://localhost:5000/products/category/${categoryName}`);
            setCategoryProducts(res.data);
            setSelectedCategory(categoryName);
        } catch (error) {
            toast.error("Kategori verileri çekilemedi.");
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setCurrentId(null);
        setProductForm({ title: '', price: '', description: '', category: '', image: '' });
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setCurrentId(product.id);
        setProductForm(product);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/products/${currentId}`, productForm);
                toast.success("Ürün güncellendi!");
            } else {
                await axios.post('http://localhost:5000/products', productForm);
                toast.success("Yeni ürün eklendi!");
            }
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("İşlem başarısız!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Silmek istediğinize emin misiniz?")) {
            await axios.delete(`http://localhost:5000/products/${id}`);
            toast.success("Ürün silindi");
            fetchData();
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/admin/orders/${orderId}`, { status: newStatus });
            toast.success("Durum güncellendi!");
            fetchData();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Poppins' }}>
            <h2 style={{ marginBottom: '20px' }}>Yönetim Paneli</h2>

            {/* Sekme Menüsü */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                {['dashboard', 'products', 'orders', 'users'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            padding: '8px 16px', cursor: 'pointer', border: 'none', borderRadius: '5px', 
                            backgroundColor: activeTab === tab ? '#b94c4c' : '#eee', 
                            color: activeTab === tab ? 'white' : 'black',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'dashboard' ? 'Dashboard' : tab === 'products' ? 'Ürün Yönetimi' : tab === 'orders' ? 'Siparişler' : 'Kullanıcılar'}
                    </button>
                ))}
            </div>

            {/* 1. DASHBOARD ALANI */}
            {activeTab === 'dashboard' && (
                <div style={{ marginTop: '20px' }}>
                    {/* KÜÇÜK KUTULAR */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                        <div onClick={() => setActiveTab('products')} style={{ flex: 1, cursor: 'pointer', background: '#007bff', color: 'white', padding: '15px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3 style={{margin: 0, fontSize: '20px'}}>{stats.totalProducts}</h3>
                            <p style={{margin: 0, fontSize: '12px'}}>Toplam Ürün</p>
                        </div>
                        <div onClick={() => setActiveTab('users')} style={{ flex: 1, cursor: 'pointer', background: '#28a745', color: 'white', padding: '15px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3 style={{margin: 0, fontSize: '20px'}}>{stats.totalUsers}</h3>
                            <p style={{margin: 0, fontSize: '12px'}}>Kayıtlı Kullanıcı</p>
                        </div>
                        <div onClick={() => setActiveTab('orders')} style={{ flex: 1, cursor: 'pointer', background: '#ffc107', color: 'white', padding: '15px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3 style={{margin: 0, fontSize: '20px'}}>{orders.filter(o => o.status === 'Hazırlanıyor').length}</h3>
                            <p style={{margin: 0, fontSize: '12px'}}>Bekleyen Sipariş</p>
                        </div>
                    </div>

                    <h3>Kategori Dağılımı</h3>
                    <p style={{fontSize: '13px', color: '#666'}}>Ürünleri görmek için kategoriye tıkla:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                        {stats.categories.map((cat, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleCategoryClick(cat.category)}
                                style={{ 
                                    border: '1px solid #ddd', padding: '8px 12px', borderRadius: '8px', 
                                    background: selectedCategory === cat.category ? '#b94c4c' : '#f8f9fa',
                                    color: selectedCategory === cat.category ? 'white' : 'black',
                                    cursor: 'pointer'
                                }}
                            >
                                <strong>{cat.category}:</strong> {cat.count} Ürün
                            </button>
                        ))}
                    </div>

                    {/* KATEGORİ ÜRÜN LİSTESİ (Dashboard Altında) */}
                    {selectedCategory && (
                        <div style={{ marginTop: '25px', background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <h4>{selectedCategory} Ürünleri</h4>
                                <button onClick={() => setSelectedCategory(null)} style={{border:'none', background:'none', color:'red', cursor:'pointer'}}>Kapat</button>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                                {categoryProducts.map(p => (
                                    <li key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid #f5f5f5', display:'flex', justifyContent:'space-between' }}>
                                        <span>{p.title}</span>
                                        <strong>{p.price}₺</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* 2. ÜRÜN YÖNETİMİ ALANI */}
            {activeTab === 'products' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Ürün Listesi</h3>
                        <button onClick={() => { isEditing ? resetForm() : setShowForm(!showForm) }} style={{ backgroundColor: showForm ? '#444' : '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            {showForm ? "Kapat" : "Yeni Ürün Ekle"}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginTop: '20px', display: 'grid', gap: '10px' }}>
                            <h3>{isEditing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
                            <input type="text" placeholder="Ürün Adı" value={productForm.title} onChange={(e) => setProductForm({...productForm, title: e.target.value})} required style={{padding:'8px'}} />
                            <input type="number" placeholder="Fiyat" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required style={{padding:'8px'}} />
                            <input type="text" placeholder="Kategori" value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} style={{padding:'8px'}} />
                            <input type="text" placeholder="Resim URL" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} style={{padding:'8px'}} />
                            <textarea placeholder="Açıklama" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} style={{padding:'8px'}} />
                            <button type="submit" style={{ backgroundColor: isEditing ? '#007bff' : '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor:'pointer' }}>
                                {isEditing ? "Güncelle" : "Kaydet"}
                            </button>
                        </form>
                    )}

                    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#444', color: 'white' }}>
                                <th style={{ padding: '12px' }}>Görsel</th>
                                <th style={{ padding: '12px' }}>Başlık</th>
                                <th style={{ padding: '12px' }}>Fiyat</th>
                                <th style={{ padding: '12px' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                    <td><img src={p.image} width="40" alt="" /></td>
                                    <td style={{ padding: '10px' }}>{p.title}</td>
                                    <td>{p.price}₺</td>
                                    <td>
                                        <button onClick={() => handleEditClick(p)} style={{ color: '#007bff', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}>Düzenle</button>
                                        <button onClick={() => handleDelete(p.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 3. SİPARİŞ YÖNETİMİ ALANI */}
            {activeTab === 'orders' && (
                <div>
                    <h3>Gelen Siparişler</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#444', color: 'white' }}>
                                <th style={{ padding: '12px' }}>No</th>
                                <th style={{ padding: '12px' }}>Müşteri</th>
                                <th style={{ padding: '12px' }}>Tutar</th>
                                <th style={{ padding: '12px' }}>Durum</th>
                                <th style={{ padding: '12px' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                    <td style={{ padding: '12px' }}>#{order.id}</td>
                                    <td>{order.username}</td>
                                    <td>{order.total_price.toFixed(2)}₺</td>
                                    <td style={{ color: order.status === 'Hazırlanıyor' ? 'orange' : 'green', fontWeight: 'bold' }}>{order.status}</td>
                                    <td>
                                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} style={{ padding: '5px' }}>
                                            <option value="Hazırlanıyor">Hazırlanıyor</option>
                                            <option value="Kargoya Verildi">Kargoya Verildi</option>
                                            <option value="Teslim Edildi">Teslim Edildi</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 4. KULLANICILAR ALANI */}
            {activeTab === 'users' && (
                <div>
                    <h3>Kayıtlı Kullanıcılar</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#444', color: 'white' }}>
                                <th style={{ padding: '12px' }}>ID</th>
                                <th style={{ padding: '12px' }}>Kullanıcı Adı</th>
                                <th style={{ padding: '12px' }}>E-posta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                    <td style={{ padding: '12px' }}>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;