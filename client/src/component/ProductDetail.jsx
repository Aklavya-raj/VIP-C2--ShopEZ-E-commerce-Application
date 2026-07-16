import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const getBackground = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('smartphones') || cat.includes('laptops')) return 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)';
  if (cat.includes('fragrances') || cat.includes('skincare') || cat.includes('beauty')) return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
  if (cat.includes('groceries') || cat.includes('food')) return 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)';
  if (cat.includes('home-decoration') || cat.includes('furniture')) return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
  return 'linear-gradient(135deg, #e3e9f5 0%, #d0d8e8 100%)';
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

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
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await api.post('/cart', { productId: id, qty });
      setAdded(true);
      setTimeout(() => { setAdded(false); navigate('/cart'); }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>Loading product...</p>
    </div>
  );
  if (!product) return null;

  const salePrice = product.discountPercentage > 0
    ? Math.round(product.price - (product.price * product.discountPercentage / 100))
    : product.price;
  const savedAmount = product.price - salePrice;
  const full = Math.round(product.rating);

  return (
    <div className="page" style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13, color: 'hsl(220,15%,50%)' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(248,89%,70%)', fontWeight: 600, fontSize: 13, padding: 0 }}>
          ← Store
        </button>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
        <span>/</span>
        <span style={{ color: 'hsl(220,25%,80%)', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 200 }}>{product.name}</span>
      </div>

      <div className="grid-2" style={{ gap: 40, alignItems: 'start' }}>
        {/* Image panel */}
        <div style={{
          background: getBackground(product.category),
          borderRadius: 24, padding: 48,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          position: 'relative', minHeight: 400,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}>
          {product.discountPercentage > 0 && (
            <div style={{
              position: 'absolute', top: 20, right: 20,
              background: 'linear-gradient(135deg,hsl(0,90%,62%),hsl(350,90%,55%))',
              color: '#fff', padding: '8px 18px', borderRadius: 99,
              fontSize: 16, fontWeight: 800,
              boxShadow: '0 6px 18px hsla(0,90%,62%,0.35)',
            }}>
              {Math.round(product.discountPercentage)}% OFF
            </div>
          )}
          <img src={product.image} alt={product.name} style={{
            maxWidth: '100%', maxHeight: 440, objectFit: 'contain',
            filter: 'drop-shadow(0 24px 32px rgba(0,0,0,0.25))',
            transition: 'transform 0.4s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Category + Brand pill */}
          <div style={{ marginBottom: 14 }}>
            <span className="badge badge-purple" style={{ fontSize: 13 }}>
              {product.category} · {product.brand}
            </span>
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ color: 'hsl(38,95%,55%)', fontSize: 18, letterSpacing: 2 }}>
              {'★'.repeat(full)}{'☆'.repeat(5 - full)}
            </span>
            <span style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>{product.numReviews} reviews</span>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 24 }}>
            {product.discountPercentage > 0 && (
              <div style={{ fontSize: 15, textDecoration: 'line-through', color: 'hsl(220,10%,42%)', marginBottom: 4 }}>
                M.R.P.: ₹{product.price.toLocaleString('en-IN')}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'Outfit, sans-serif', fontSize: 38, fontWeight: 800,
                background: 'linear-gradient(135deg, hsl(248,89%,70%), hsl(270,80%,72%))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                ₹{salePrice.toLocaleString('en-IN')}
              </span>
              {savedAmount > 0 && (
                <span style={{ fontSize: 14, color: 'hsl(150,80%,48%)', background: 'hsla(150,80%,48%,0.1)', padding: '5px 12px', borderRadius: 8, fontWeight: 700, border: '1px solid hsla(150,80%,48%,0.2)' }}>
                  Save ₹{savedAmount.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'hsl(220,15%,58%)', lineHeight: 1.75, marginBottom: 28, fontSize: 15 }}>
            {product.description}
          </p>

          {/* Purchase card */}
          <div style={{
            background: 'hsla(240,12%,12%,0.75)',
            border: '1px solid hsla(248,50%,70%,0.12)',
            borderRadius: 18, padding: 24,
            backdropFilter: 'blur(12px)',
          }}>
            {/* Stock status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid hsl(240,12%,18%)' }}>
              <span style={{ color: 'hsl(220,15%,55%)', fontWeight: 500 }}>Availability</span>
              <span style={{
                fontWeight: 700,
                color: product.countInStock > 0 ? 'hsl(150,80%,48%)' : 'hsl(0,90%,62%)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: product.countInStock > 0 ? 'hsl(150,80%,48%)' : 'hsl(0,90%,62%)',
                  animation: product.countInStock > 0 ? 'pulse-ring 2s infinite' : 'none',
                  display: 'inline-block',
                }} />
                {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty selector */}
            {product.countInStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ color: 'hsl(220,15%,55%)', fontWeight: 500 }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid hsl(240,12%,22%)', background: 'hsl(240,12%,18%)', color: 'hsl(220,25%,90%)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(248,89%,66%)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(240,12%,22%)'}
                  >−</button>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid hsl(240,12%,22%)', background: 'hsl(240,12%,18%)', color: 'hsl(220,25%,90%)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(248,89%,66%)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(240,12%,22%)'}
                  >+</button>
                </div>
              </div>
            )}

            <button
              className={`btn ${added ? 'btn-success' : 'btn-primary'}`}
              style={{ width: '100%', padding: '16px', fontSize: 16, borderRadius: 14 }}
              disabled={product.countInStock === 0 || adding}
              onClick={addToCart}
            >
              {added ? '✓ Added to Cart!' : adding ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                </span>
              ) : product.countInStock === 0 ? 'Out of Stock' : `🛒 Add ${qty > 1 ? `${qty} items` : 'to Cart'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
