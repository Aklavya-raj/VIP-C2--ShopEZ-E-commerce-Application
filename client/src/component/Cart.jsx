import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
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

  useEffect(() => { fetchCart(); }, []);

  const removeFromCart = async (productId) => {
    setRemovingId(productId);
    try {
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>Loading your cart...</p>
    </div>
  );

  const getSalePrice = (product) =>
    product.discountPercentage > 0
      ? Math.round(product.price - (product.price * product.discountPercentage / 100))
      : product.price;

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * getSalePrice(item.product), 0);
  const originalTotal = cart.reduce((acc, item) => acc + item.qty * item.product.price, 0);
  const totalSaved = originalTotal - totalPrice;

  return (
    <div className="page" style={{ animation: 'fadeIn 0.35s ease' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
          🛒 Shopping Cart
        </h1>
        {cart.length > 0 && (
          <p style={{ color: 'hsl(220,15%,55%)', fontSize: 15 }}>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        )}
      </div>

      {cart.length === 0 ? (
        <div style={{
          background: 'hsla(240,12%,12%,0.75)',
          border: '1px solid hsla(248,50%,70%,0.09)',
          borderRadius: 24, padding: '80px 40px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          animation: 'scaleIn 0.35s ease',
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🛍️</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Your cart is empty</h2>
          <p style={{ color: 'hsl(220,15%,55%)', marginBottom: 28, fontSize: 15 }}>Looks like you haven't added anything yet!</p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '13px 32px', fontSize: 15 }}>
            🛍️ Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28, alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{
            background: 'hsla(240,12%,12%,0.75)',
            border: '1px solid hsla(248,50%,70%,0.09)',
            borderRadius: 20, overflow: 'hidden',
            backdropFilter: 'blur(12px)',
          }}>
            {cart.map((item, index) => {
              const salePrice = getSalePrice(item.product);
              const originalPrice = item.product.price;
              const saved = (originalPrice - salePrice) * item.qty;
              const isRemoving = removingId === item.product._id;

              return (
                <div key={item.product._id} style={{
                  display: 'flex', alignItems: 'center', gap: 18, padding: '20px 24px',
                  borderBottom: index < cart.length - 1 ? '1px solid hsl(240,12%,16%)' : 'none',
                  transition: 'opacity 0.2s, background 0.15s',
                  opacity: isRemoving ? 0.4 : 1,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'hsla(248,89%,66%,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Image */}
                  <div style={{
                    width: 86, height: 86, borderRadius: 12, overflow: 'hidden',
                    background: '#fff', padding: 8, flexShrink: 0,
                    border: '1px solid hsl(240,12%,22%)',
                    cursor: 'pointer',
                  }} onClick={() => navigate(`/product/${item.product._id}`)}>
                    <img src={item.product.image} alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      onClick={() => navigate(`/product/${item.product._id}`)}
                      style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {item.product.name}
                    </h3>
                    <div style={{ color: 'hsl(220,15%,50%)', fontSize: 13, marginBottom: 6 }}>
                      Qty: {item.qty}
                    </div>
                    {saved > 0 && (
                      <span style={{ fontSize: 12, color: 'hsl(150,80%,48%)', background: 'hsla(150,80%,48%,0.1)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        Save ₹{saved.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: 'hsl(248,89%,72%)' }}>
                      ₹{(salePrice * item.qty).toLocaleString('en-IN')}
                    </div>
                    {item.product.discountPercentage > 0 && (
                      <div style={{ fontSize: 12, textDecoration: 'line-through', color: 'hsl(220,10%,42%)', marginTop: 2 }}>
                        ₹{(originalPrice * item.qty).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    disabled={isRemoving}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
                      background: 'hsla(0,90%,62%,0.08)',
                      border: '1px solid hsla(0,90%,62%,0.18)',
                      color: 'hsl(0,90%,62%)', fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'hsla(0,90%,62%,0.18)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'hsla(0,90%,62%,0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'hsla(240,12%,12%,0.75)',
            border: '1px solid hsla(248,50%,70%,0.09)',
            borderRadius: 20, padding: 26,
            position: 'sticky', top: 90,
            backdropFilter: 'blur(12px)',
          }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 22 }}>Order Summary</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'hsl(220,15%,55%)' }}>Subtotal ({totalItems} items)</span>
              <span style={{ fontWeight: 600 }}>₹{originalTotal.toLocaleString('en-IN')}</span>
            </div>
            {totalSaved > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'hsl(220,15%,55%)' }}>Discount</span>
                <span style={{ fontWeight: 600, color: 'hsl(150,80%,48%)' }}>−₹{totalSaved.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'hsl(220,15%,55%)' }}>Shipping</span>
              <span style={{ fontWeight: 600, color: 'hsl(150,80%,48%)' }}>FREE</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 18, marginTop: 18, borderTop: '1px solid hsl(240,12%,18%)' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, background: 'linear-gradient(135deg,hsl(248,89%,70%),hsl(270,80%,72%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {totalSaved > 0 && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'hsla(150,80%,48%,0.08)', border: '1px solid hsla(150,80%,48%,0.18)', borderRadius: 10, fontSize: 13, color: 'hsl(150,80%,50%)', textAlign: 'center', fontWeight: 600 }}>
                🎉 You save ₹{totalSaved.toLocaleString('en-IN')} on this order!
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 22, padding: '16px', fontSize: 16, borderRadius: 14 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <button
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 10, fontSize: 14 }}
              onClick={() => navigate('/')}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
