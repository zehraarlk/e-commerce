import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // axios'u import etmeyi unutma

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/register', {
            username,
            email,
            password
        });
        
        if (response.status === 201) {
            toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
            setTimeout(() => navigate('/login'), 2000);
        }
    } catch (err) {
        toast.error(err.response?.data?.error || "Kayıt sırasında bir hata oluştu.");
    }
};

    return (
        <div className="flex-column" style={{ marginTop: '60px', minHeight: '70vh' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '350px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#222' }}>Kayıt Ol</h2>
                <form onSubmit={handleRegister} className="flex-column" style={{ gap: '20px' }}>
                    <input 
                        className='search-input'
                        style={{ width: '100%', border: '1px solid #eee', padding: '12px' }}
                        type="text" 
                        placeholder="Kullanıcı Adı" 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        className='search-input'
                        style={{ width: '100%', border: '1px solid #eee', padding: '12px' }}
                        type="email" 
                        placeholder="E-posta Adresi" 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        className='search-input'
                        style={{ width: '100%', border: '1px solid #eee', padding: '12px' }}
                        type="password" 
                        placeholder="Şifre" 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="add-basket-button" style={{ width: '100%', marginTop: '10px' }}>Hesap Oluştur</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    Zaten üye misin? <span onClick={() => navigate('/login')} style={{ color: '#b94c4c', cursor: 'pointer', fontWeight: '600' }}>Giriş Yap</span>
                </p>
            </div>
        </div>
    );
}

export default Register;