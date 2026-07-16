import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const STEPS = ['Shipping Address', 'Payment Method', 'Place Order'];

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/cart');
        if (data.length === 0) navigate('/cart');
        setCart(data);
      } catch {
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  );

  const getSalePrice = (product) =>
    product.discountPercentage > 0
      ? Math.round(product.price - (product.price * product.discountPercentage / 100))
      : product.price;

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * getSalePrice(item.product), 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      const itemsPrice = totalPrice;
      const orderItems = cart.map(item => ({
        name: item.product.name,
        qty: item.qty,
        image: item.product.image,
        price: getSalePrice(item.product),
        product: item.product._id,
      }));
      await api.post('/orders', {
        orderItems, shippingAddress: address,
        paymentMethod: 'Cash On Delivery',
        itemsPrice, taxPrice: 0, shippingPrice: 0, totalPrice: itemsPrice,
      });
      await api.delete('/cart');
      navigate('/orders');
    } catch {
      alert('Failed to place order');
      setPlacingOrder(false);
    }
  };

  const cardStyle = {
    background: 'hsla(240,12%,12%,0.75)',
    border: '1px solid hsla(248,50%,70%,0.09)',
    borderRadius: 20, padding: 28,
    backdropFilter: 'blur(12px)',
  };

  return (
    <div className="page" style={{ animation: 'fadeIn 0.35s ease' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, marginBottom: 32, letterSpacing: '-0.02em' }}>
        Checkout
      </h1>

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: i <= step ? 'linear-gradient(135deg,hsl(248,89%,66%),hsl(270,80%,68%))' : 'hsl(240,12%,18%)',
                border: i === step ? '2px solid hsl(248,89%,70%)' : '2px solid hsl(240,12%,22%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14,
                color: i <= step ? '#fff' : 'hsl(220,10%,40%)',
                boxShadow: i === step ? '0 0 0 4px hsla(248,89%,66%,0.15)' : 'none',
                transition: 'all 0.3s',
                flexShrink: 0,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: i <= step ? 'hsl(220,25%,88%)' : 'hsl(220,10%,40%)' }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? 'linear-gradient(90deg,hsl(248,89%,66%),hsl(270,80%,68%))' : 'hsl(240,12%,18%)', margin: '0 12px', transition: 'background 0.3s' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Left form */}
        <form onSubmit={placeOrder}>
          {/* Shipping */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 22 }}>
              📍 Shipping Address
            </h2>
            <div className="form-group">
              <label>Street Address</label>
              <input required placeholder="123 Main St, Apartment 4B" value={address.address}
                onChange={e => { setAddress({ ...address, address: e.target.value }); setStep(0); }} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>City</label>
                <input required placeholder="Mumbai" value={address.city}
                  onChange={e => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input required placeholder="400001" value={address.postalCode}
                  onChange={e => setAddress({ ...address, postalCode: e.target.value })} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Country</label>
              <input required placeholder="India" value={address.country}
                onChange={e => setAddress({ ...address, country: e.target.value })} />
            </div>
          </div>

          {/* Payment */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
              💳 Payment Method
            </h2>
            <div style={{
              padding: '16px 20px',
              border: '2px solid hsl(248,89%,66%)',
              borderRadius: 14,
              background: 'hsla(248,89%,66%,0.06)',
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: '2px solid hsl(248,89%,66%)',
                background: 'hsl(248,89%,66%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Cash On Delivery (COD)</div>
                <div style={{ color: 'hsl(220,15%,55%)', fontSize: 13 }}>Pay when your order arrives</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 24 }}>🚚</span>
            </div>
          </div>

          <button type="submit" className="btn btn-success"
            style={{ width: '100%', padding: '16px', fontSize: 16, borderRadius: 14 }}
            disabled={placingOrder}>
            {placingOrder ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> Placing Order...
              </span>
            ) : '✅ Place Order'}
          </button>
        </form>

        {/* Summary */}
        <div style={{ ...cardStyle, position: 'sticky', top: 90 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>

          {/* Items preview */}
          <div style={{ marginBottom: 18 }}>
            {cart.map(item => (
              <div key={item.product._id} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#fff', padding: 4, flexShrink: 0, border: '1px solid hsl(240,12%,22%)' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                  <div style={{ fontSize: 12, color: 'hsl(220,15%,50%)' }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  ₹{(getSalePrice(item.product) * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid hsl(240,12%,18%)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'hsl(220,15%,55%)' }}>Items</span>
              <span style={{ fontWeight: 600 }}>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'hsl(220,15%,55%)' }}>Shipping</span>
              <span style={{ fontWeight: 600, color: 'hsl(150,80%,48%)' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, marginTop: 14, borderTop: '1px solid hsl(240,12%,18%)' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, background: 'linear-gradient(135deg,hsl(248,89%,70%),hsl(270,80%,72%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
