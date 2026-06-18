import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const addToCart = async () => {
    if (!user) {
      alert('Please login to add to cart');
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart', { productId: id, qty });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!product) return null;

  const salePrice = product.discountPercentage > 0 
    ? Math.round(product.price - (product.price * product.discountPercentage / 100))
    : product.price;

  const getBackground = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('smartphones') || cat.includes('laptops') || cat.includes('tech')) return 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)';
    if (cat.includes('fragrances') || cat.includes('beauty') || cat.includes('skincare')) return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)';
    if (cat.includes('groceries') || cat.includes('food')) return 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)';
    if (cat.includes('home-decoration') || cat.includes('furniture')) return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
    return 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)';
  };

  return (
    <div className="page">
      <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginBottom: 24, padding: '8px 16px', fontSize: 13 }}>
        ← Back to Store
      </button>

      <div className="grid-2" style={{ gap: 40, alignItems: 'start' }}>
        {/* Left: Image */}
        <div className="card" style={{ padding: 40, background: getBackground(product.category), display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {product.discountPercentage > 0 && (
            <div style={{ position: 'absolute', top: 20, right: 20, background: '#ff4757', color: '#fff', padding: '8px 16px', borderRadius: 30, fontSize: 16, fontWeight: 800, zIndex: 1, boxShadow: '0 4px 12px rgba(255,71,87,0.3)' }}>
              {Math.round(product.discountPercentage)}% OFF
            </div>
          )}
          <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.3))' }} />
        </div>

        {/* Right: Details */}
        <div>
          <div className="badge badge-purple" style={{ marginBottom: 12 }}>{product.category} • {product.brand}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ color: '#ffd700', fontSize: 20 }}>{'★'.repeat(Math.round(product.rating))}</span>
            <span style={{ color: '#94a3b8' }}>({product.numReviews} reviews)</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            {product.discountPercentage > 0 && (
              <div style={{ fontSize: 16, textDecoration: 'line-through', color: '#94a3b8', marginBottom: 4 }}>
                M.R.P.: ₹{product.price.toLocaleString('en-IN')}
              </div>
            )}
            <div style={{ fontSize: 36, fontWeight: 800, color: '#6c63ff', display: 'flex', alignItems: 'center', gap: 12 }}>
              ₹{salePrice.toLocaleString('en-IN')}
              {product.discountPercentage > 0 && (
                <span style={{ fontSize: 14, color: '#00d084', background: 'rgba(0,208,132,0.1)', padding: '4px 10px', borderRadius: 8 }}>
                  Save ₹{(product.price - salePrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 32, fontSize: 16 }}>
            {product.description}
          </p>

          <div className="card" style={{ padding: 24, background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid #1e293b', paddingBottom: 16 }}>
              <span style={{ color: '#94a3b8' }}>Status:</span>
              <span style={{ fontWeight: 700, color: product.countInStock > 0 ? '#00d084' : '#ff4757' }}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <span style={{ color: '#94a3b8' }}>Quantity:</span>
                <select 
                  value={qty} 
                  onChange={e => setQty(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 8, background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
                >
                  {[...Array(product.countInStock).keys()].map(x => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: 16, fontSize: 16, fontWeight: 700 }}
              disabled={product.countInStock === 0}
              onClick={addToCart}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
