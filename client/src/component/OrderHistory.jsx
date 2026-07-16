import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const StatusBadge = ({ isDelivered }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 700,
    background: isDelivered ? 'hsla(150,80%,48%,0.1)' : 'hsla(38,95%,55%,0.1)',
    border: `1px solid ${isDelivered ? 'hsla(150,80%,48%,0.25)' : 'hsla(38,95%,55%,0.25)'}`,
    color: isDelivered ? 'hsl(150,80%,50%)' : 'hsl(38,95%,58%)',
  }}>
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      background: isDelivered ? 'hsl(150,80%,48%)' : 'hsl(38,95%,55%)',
      animation: !isDelivered ? 'pulse-ring 2s infinite' : 'none',
      display: 'inline-block',
    }} />
    {isDelivered ? '✓ Delivered' : 'Processing'}
  </div>
);

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>Loading your orders...</p>
    </div>
  );

  return (
    <div className="page" style={{ animation: 'fadeIn 0.35s ease' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
          📦 My Orders
        </h1>
        {orders.length > 0 && (
          <p style={{ color: 'hsl(220,15%,55%)', fontSize: 15 }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        )}
      </div>

      {orders.length === 0 ? (
        <div style={{
          background: 'hsla(240,12%,12%,0.75)',
          border: '1px solid hsla(248,50%,70%,0.09)',
          borderRadius: 24, padding: '80px 40px',
          textAlign: 'center', backdropFilter: 'blur(12px)',
          animation: 'scaleIn 0.35s ease',
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📜</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 10 }}>No orders yet</h2>
          <p style={{ color: 'hsl(220,15%,55%)', marginBottom: 28, fontSize: 15 }}>You haven't placed any orders. Start shopping!</p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '13px 32px', fontSize: 15 }}>
            🛍️ Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((order, idx) => (
            <div key={order._id}
              style={{
                background: 'hsla(240,12%,12%,0.75)',
                border: '1px solid hsla(248,50%,70%,0.09)',
                borderRadius: 20, overflow: 'hidden',
                backdropFilter: 'blur(12px)',
                animation: `fadeInUp 0.4s ease ${idx * 0.06}s both`,
              }}>

              {/* Order Header */}
              <div style={{
                padding: '16px 24px',
                background: 'hsl(240,12%,10%)',
                borderBottom: '1px solid hsl(240,12%,16%)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: 16, alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'hsl(220,10%,40%)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Order Placed
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'hsl(220,10%,40%)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Total
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, color: 'hsl(248,89%,72%)' }}>
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'hsl(220,10%,40%)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Order #
                  </div>
                  <div style={{ fontWeight: 500, fontSize: 12, fontFamily: 'monospace', color: 'hsl(220,15%,60%)' }}>
                    {order._id.slice(-10).toUpperCase()}
                  </div>
                </div>
                <StatusBadge isDelivered={order.isDelivered} />
              </div>

              {/* Order Items */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {order.orderItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: 10, background: '#fff', padding: 6, flexShrink: 0,
                        border: '1px solid hsl(240,12%,22%)', cursor: 'pointer',
                      }} onClick={() => navigate(`/product/${item.product}`)}>
                        <img src={item.image} alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          onClick={() => navigate(`/product/${item.product}`)}
                          style={{ fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'hsl(248,89%,70%)'}
                          onMouseLeave={e => e.currentTarget.style.color = ''}>
                          {item.name}
                        </div>
                        <div style={{ color: 'hsl(220,15%,50%)', fontSize: 13 }}>
                          Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                        ₹{(item.qty * item.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
