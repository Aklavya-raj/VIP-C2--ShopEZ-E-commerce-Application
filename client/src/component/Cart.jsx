import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const getSalePrice = (product) => {
    return product.discountPercentage > 0 
      ? Math.round(product.price - (product.price * product.discountPercentage / 100))
      : product.price;
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * getSalePrice(item.product), 0);

  return (
    <div className="page">
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
          {/* Cart Items */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {cart.map((item, index) => (
              <div key={item.product._id} style={{ 
                display: 'flex', alignItems: 'center', gap: 20, padding: 24,
                borderBottom: index < cart.length - 1 ? '1px solid #1e293b' : 'none' 
              }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'contain', background: '#fff', padding: 8, borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <h3 
                    style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${item.product._id}`)}
                    className="hover-pointer"
                  >
                    {item.product.name}
                  </h3>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>
                  <div>₹{(getSalePrice(item.product) * item.qty).toLocaleString('en-IN')}</div>
                  {item.product.discountPercentage > 0 && (
                    <div style={{ fontSize: 12, textDecoration: 'line-through', color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>
                      ₹{(item.product.price * item.qty).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => removeFromCart(item.product._id)}
                  style={{ background: 'rgba(255,71,87,0.1)', color: '#ff4757', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ position: 'sticky', top: 90 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#94a3b8' }}>Items ({totalItems})</span>
              <span style={{ fontWeight: 600 }}>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#94a3b8' }}>Shipping</span>
              <span style={{ fontWeight: 600 }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, marginTop: 16, borderTop: '1px solid #1e293b' }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Total</span>
              <span style={{ fontWeight: 800, color: '#6c63ff', fontSize: 20 }}>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: 24, padding: '16px', fontSize: 16 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
