import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/cart');
        if (data.length === 0) navigate('/cart');
        setCart(data);
      } catch (err) {
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const getSalePrice = (product) => {
    return product.discountPercentage > 0 
      ? Math.round(product.price - (product.price * product.discountPercentage / 100))
      : product.price;
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * getSalePrice(item.product), 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      const itemsPrice = cart.reduce((acc, item) => acc + item.qty * getSalePrice(item.product), 0);
      const orderItems = cart.map(item => ({
        name: item.product.name,
        qty: item.qty,
        image: item.product.image,
        price: getSalePrice(item.product),
        product: item.product._id
      }));

      await api.post('/orders', {
        orderItems,
        shippingAddress: address,
        paymentMethod: 'Cash On Delivery',
        itemsPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: itemsPrice
      });

      await api.delete('/cart'); // Clear cart
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order');
      setPlacingOrder(false);
    }
  };
  return (
    <div className="page">
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Checkout</h1>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
        <form onSubmit={placeOrder} className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Shipping Address</h2>
          <div className="form-group">
            <label>Address</label>
            <input required value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>City</label>
              <input required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input required value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input required value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} />
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, marginTop: 32 }}>Payment Method</h2>
          <div style={{ padding: 16, border: '1px solid #1e293b', borderRadius: 8, background: 'rgba(108,99,255,0.05)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', margin: 0 }}>
              <input type="radio" checked readOnly />
              <span style={{ fontWeight: 600 }}>Cash On Delivery (COD)</span>
            </label>
          </div>
        </form>

        <div className="card" style={{ position: 'sticky', top: 90 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#94a3b8' }}>Items</span>
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
            className="btn btn-success" 
            style={{ width: '100%', marginTop: 24, padding: '16px', fontSize: 16 }}
            onClick={placeOrder}
            disabled={placingOrder}
          >
            {placingOrder ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
