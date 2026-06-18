import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

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

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📜</div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>You haven't placed any orders yet</h2>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid-1" style={{ gap: 24 }}>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ background: '#1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>ORDER PLACED</div>
                  <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>TOTAL</div>
                  <div style={{ fontWeight: 600 }}>₹{order.totalPrice.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>ORDER #</div>
                  <div style={{ fontWeight: 600 }}>{order._id}</div>
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: order.isDelivered ? '#00d084' : '#f59e0b' }}>
                  {order.isDelivered ? 'Delivered' : 'Processing'}
                </h3>
                {order.orderItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < order.orderItems.length - 1 ? 16 : 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'contain', background: '#fff', padding: 8, borderRadius: 8 }} />
                    <div>
                      <div 
                        style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${item.product}`)}
                        className="hover-pointer"
                      >
                        {item.name}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 14 }}>Qty: {item.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
