import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'hsla(240,12%,12%,0.75)',
    border: `1px solid ${color}22`,
    borderRadius: 18, padding: '22px 24px',
    backdropFilter: 'blur(12px)',
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: -12, right: -12,
      width: 80, height: 80, borderRadius: '50%',
      background: `${color}12`,
    }} />
    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 28, fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginBottom: 4, color }}>{value}</div>
    <div style={{ fontSize: 13, color: 'hsl(220,15%,50%)', fontWeight: 500 }}>{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>Loading dashboard...</p>
    </div>
  );

  const totalStock = products.reduce((a, p) => a + p.countInStock, 0);
  const outOfStock = products.filter(p => p.countInStock === 0).length;
  const categories = [...new Set(products.map(p => p.category))].length;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const getStockColor = (count) => {
    if (count === 0) return 'hsl(0,90%,62%)';
    if (count < 5) return 'hsl(38,95%,55%)';
    return 'hsl(150,80%,48%)';
  };

  return (
    <div className="page" style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, hsl(38,95%,55%), hsl(25,95%,58%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            boxShadow: '0 6px 18px hsla(38,95%,55%,0.3)',
          }}>⚙️</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
        </div>
        <p style={{ color: 'hsl(220,15%,55%)', fontSize: 15, marginLeft: 52 }}>Manage your products and inventory</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatCard icon="📦" label="Total Products" value={products.length} color="hsl(248,89%,70%)" />
        <StatCard icon="🏷️" label="Categories" value={categories} color="hsl(175,85%,48%)" />
        <StatCard icon="🗄️" label="Total Stock" value={totalStock} color="hsl(150,80%,50%)" />
        <StatCard icon="⚠️" label="Out of Stock" value={outOfStock} color="hsl(38,95%,58%)" />
      </div>

      {/* Products Table */}
      <div style={{
        background: 'hsla(240,12%,12%,0.75)',
        border: '1px solid hsla(248,50%,70%,0.09)',
        borderRadius: 20, overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Table header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid hsl(240,12%,16%)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 16,
        }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700 }}>Product Inventory</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(220,15%,45%)', pointerEvents: 'none' }}>🔍</span>
              <input
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36, width: 220, height: 38, fontSize: 13 }}
              />
            </div>
            <button className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 14 }}>
              + Add Product
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'hsl(220,15%,45%)' }}>
                    No products found
                  </td>
                </tr>
              ) : filtered.map(product => (
                <tr key={product._id}>
                  {/* Product col */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 8, background: '#fff', padding: 4,
                        border: '1px solid hsl(240,12%,22%)', flexShrink: 0,
                      }}>
                        <img src={product.image} alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 180 }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'hsl(220,10%,40%)', fontFamily: 'monospace' }}>
                          {product._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple" style={{ fontSize: 12 }}>{product.category}</span>
                  </td>
                  <td style={{ color: 'hsl(220,15%,60%)', fontSize: 13 }}>{product.brand}</td>
                  <td>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15 }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    {product.discountPercentage > 0 && (
                      <div style={{ fontSize: 11, color: 'hsl(150,80%,50%)', fontWeight: 600 }}>
                        {Math.round(product.discountPercentage)}% off
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                      background: `${getStockColor(product.countInStock)}14`,
                      color: getStockColor(product.countInStock),
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: getStockColor(product.countInStock), display: 'inline-block' }} />
                      {product.countInStock}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'hsl(38,95%,55%)', letterSpacing: 1, fontSize: 13 }}>
                      {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 12 }}>
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid hsl(240,12%,16%)', color: 'hsl(220,15%,50%)', fontSize: 13 }}>
          Showing {filtered.length} of {products.length} products
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
