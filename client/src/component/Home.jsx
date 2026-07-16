import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration'];

const getBackground = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('smartphones') || cat.includes('laptops')) return 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)';
  if (cat.includes('fragrances') || cat.includes('skincare') || cat.includes('beauty')) return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
  if (cat.includes('groceries') || cat.includes('food')) return 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)';
  if (cat.includes('home-decoration') || cat.includes('furniture')) return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
  return 'linear-gradient(135deg, #e3e9f5 0%, #d0d8e8 100%)';
};

const StarRating = ({ rating, numReviews }) => {
  const full = Math.round(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'hsl(38,95%,55%)', fontSize: 14, letterSpacing: 1 }}>
        {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      </span>
      <span style={{ color: 'hsl(220,15%,50%)', fontSize: 12 }}>({numReviews})</span>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const addToCart = async (productId, e) => {
    e.stopPropagation();
    setAddingId(productId);
    try {
      await api.post('/cart', { productId, qty: 1 });
      showToast('🛒 Added to cart!');
    } catch (err) {
      navigate('/login');
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>Loading products...</p>
    </div>
  );

  return (
    <div className="page">
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 90, right: 24, zIndex: 999,
          background: 'hsl(150,80%,48%)', color: '#fff',
          padding: '12px 22px', borderRadius: 12, fontWeight: 600,
          boxShadow: '0 8px 24px hsla(150,80%,48%,0.35)',
          animation: 'fadeInUp 0.3s ease',
        }}>{toastMsg}</div>
      )}

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40, padding: '20px 0' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
          padding: '6px 16px', borderRadius: 99,
          background: 'hsla(248,89%,66%,0.1)', border: '1px solid hsla(248,89%,66%,0.2)',
        }}>
          <span style={{ fontSize: 14 }}>✨</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'hsl(248,89%,72%)' }}>
            Premium E-Commerce Experience
          </span>
        </div>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: 14,
          lineHeight: 1.15,
        }}>
          Discover Amazing{' '}
          <span style={{ background: 'linear-gradient(135deg, hsl(248,89%,70%), hsl(270,80%,72%), hsl(175,85%,55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Products
          </span>
        </h1>
        <p style={{ color: 'hsl(220,15%,55%)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
          Shop the best deals on electronics, beauty, and more — delivered to your door.
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 28, maxWidth: 620, margin: '0 auto 28px auto', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'hsl(220,15%,45%)', fontSize: 18, pointerEvents: 'none' }}>🔍</span>
        <input
          placeholder="Search products by name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 52, borderRadius: 50, fontSize: 15, height: 52 }}
        />
        {search && (
          <button onClick={() => setSearch('')}
            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220,15%,45%)', fontSize: 18 }}>
            ✕
          </button>
        )}
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 32, scrollbarWidth: 'none' }} className="no-scrollbar">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`pill ${category === cat ? 'active' : ''}`}>
            {cat === 'All' ? '🌐 All' : cat}
          </button>
        ))}
      </div>

      {/* Product count */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>
          Showing <strong style={{ color: 'hsl(220,25%,90%)' }}>{filtered.length}</strong> products
          {category !== 'All' && <> in <strong style={{ color: 'hsl(248,89%,70%)' }}>{category}</strong></>}
        </span>
      </div>

      {/* Grid */}
      <div className="grid-3" style={{ gap: 22 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'hsl(220,15%,45%)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products found</div>
            <div style={{ fontSize: 14 }}>Try adjusting your search or category filter</div>
          </div>
        ) : filtered.map((product, idx) => {
          const salePrice = product.discountPercentage > 0
            ? Math.round(product.price - (product.price * product.discountPercentage / 100))
            : product.price;

          return (
            <div key={product._id}
              style={{
                background: 'hsla(240,12%,12%,0.75)',
                border: '1px solid hsla(248,50%,70%,0.09)',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                position: 'relative',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s, border-color 0.25s',
                animation: `fadeInUp 0.4s ease ${idx * 0.04}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 50px hsla(248,89%,66%,0.14), 0 8px 20px rgba(0,0,0,0.35)';
                e.currentTarget.style.borderColor = 'hsla(248,89%,66%,0.22)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'hsla(248,50%,70%,0.09)';
              }}
            >
              {/* Discount badge */}
              {product.discountPercentage > 0 && (
                <div style={{
                  position: 'absolute', top: 14, left: 14, zIndex: 2,
                  background: 'linear-gradient(135deg, hsl(0,90%,62%), hsl(350,90%,55%))',
                  color: '#fff', padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 800,
                  boxShadow: '0 4px 12px hsla(0,90%,62%,0.35)',
                }}>
                  {Math.round(product.discountPercentage)}% OFF
                </div>
              )}

              {/* Image */}
              <div
                onClick={() => navigate(`/product/${product._id}`)}
                style={{
                  height: 200, background: getBackground(product.category),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', padding: 24,
                }}>
                <img src={product.image} alt={product.name} style={{
                  maxHeight: '100%', maxWidth: '100%', objectFit: 'contain',
                  filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.18))',
                  transition: 'transform 0.35s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              {/* Details */}
              <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 11, color: 'hsl(220,15%,45%)', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {product.category} · {product.brand}
                </div>
                <h3
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{
                    fontSize: 15, fontWeight: 700, marginBottom: 10, lineHeight: 1.4, cursor: 'pointer',
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                  {product.name}
                </h3>

                <StarRating rating={product.rating} numReviews={product.numReviews} />

                <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    {product.discountPercentage > 0 && (
                      <div style={{ fontSize: 12, textDecoration: 'line-through', color: 'hsl(220,10%,40%)', marginBottom: 2 }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    )}
                    <div style={{
                      fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800,
                      background: 'linear-gradient(135deg, hsl(248,89%,70%), hsl(270,80%,72%))',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      ₹{salePrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: 13, borderRadius: 10 }}
                    onClick={(e) => addToCart(product._id, e)}
                    disabled={product.countInStock === 0 || addingId === product._id}
                  >
                    {product.countInStock === 0 ? 'Out of Stock' : addingId === product._id ? '...' : '+ Cart'}
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
