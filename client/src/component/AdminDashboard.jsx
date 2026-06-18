import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>⚙️ Admin Dashboard</h1>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Manage Products</h2>
          <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 14 }}>+ Add Product</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td style={{ color: '#94a3b8', fontSize: 13 }}>{product._id.substring(0, 8)}...</td>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td style={{ fontWeight: 700 }}>₹{product.price.toLocaleString('en-IN')}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td style={{ color: product.countInStock > 0 ? '#00d084' : '#ff4757', fontWeight: 600 }}>
                    {product.countInStock}
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 12 }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
