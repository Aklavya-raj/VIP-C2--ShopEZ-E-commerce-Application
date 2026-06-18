import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = async (productId) => {
    try {
      await api.post('/cart', { productId, qty: 1 });
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
      alert('Please login to add to cart');
      navigate('/login');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          🛍️ Welcome to <span style={{ color: '#6c63ff' }}>SHOP-EZ</span>
        </h1>
        <p style={{ color: '#94a3b8' }}>Discover the best products at unbeatable prices.</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 32, maxWidth: 600, margin: '0 auto 32px auto', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
        <input
          placeholder="Search products by name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 42, width: '100%', borderRadius: 30 }}
        />
      </div>

      {/* Product Grid */}
      <div className="grid-3" style={{ gap: 24 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: 40 }}>No products found</div>
        ) : filtered.map(product => {
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
            <div key={product._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {product.discountPercentage > 0 && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#ff4757', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800, zIndex: 1 }}>
                  {Math.round(product.discountPercentage)}% OFF
                </div>
              )}
              <div 
                style={{ height: 200, background: getBackground(product.category), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 20 }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
              </div>
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{product.category} • {product.brand}</div>
                <h3 
                  style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="hover-pointer text-ellipsis"
                >
                  {product.name}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                  <span style={{ color: '#ffd700' }}>{'★'.repeat(Math.round(product.rating))}</span>
                  <span style={{ color: '#94a3b8', fontSize: 12 }}>({product.numReviews})</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    {product.discountPercentage > 0 && (
                      <div style={{ fontSize: 13, textDecoration: 'line-through', color: '#94a3b8', marginBottom: 2 }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    )}
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#6c63ff' }}>₹{salePrice.toLocaleString('en-IN')}</div>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '8px 16px', fontSize: 14 }}
                    onClick={() => addToCart(product._id)}
                    disabled={product.countInStock === 0}
                  >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
