import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const GOOGLE_CLIENT_ID = '818489161513-cg8gf6dvk9j1kj923jitnkgk5nq3tmsm.apps.googleusercontent.com';

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const { data } = await api.post('/auth/google', { credential: credentialResponse.credential });
      localStorage.setItem('shopez_user', JSON.stringify(data));
      window.location.href = '/';
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message || 'Unknown error';
      setError(`Google login failed: ${detail}`);
    }
  };

  const handleGoogleError = () => setError('Google Sign-In was cancelled or failed. Please try again.');

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'hsl(240,15%,6%)',
        backgroundImage: 'radial-gradient(ellipse 70% 60% at 0% 0%, hsla(248,80%,55%,0.15) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, hsla(270,70%,60%,0.1) 0%, transparent 55%)',
      }}>

        {/* Left decorative panel */}
        <div style={{
          flex: 1, display: 'none',
          background: 'linear-gradient(145deg, hsla(248,80%,55%,0.15), hsla(270,70%,60%,0.1))',
          borderRight: '1px solid hsla(248,50%,70%,0.08)',
          alignItems: 'center', justifyContent: 'center',
          padding: 60, flexDirection: 'column', textAlign: 'center',
        }} className="login-left-panel">
          <div style={{
            width: 90, height: 90, borderRadius: '24px', margin: '0 auto 28px',
            background: 'linear-gradient(135deg, hsl(248,89%,66%), hsl(270,80%,68%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#fff', fontSize: 44,
            boxShadow: '0 16px 40px hsla(248,89%,66%,0.4)',
            animation: 'float 4s ease-in-out infinite',
          }}>S</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Welcome back to<br />
            <span style={{ background: 'linear-gradient(135deg,hsl(248,89%,70%),hsl(270,80%,72%))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ShopEZ</span>
          </h2>
          <p style={{ color: 'hsl(220,15%,58%)', fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
            Discover thousands of products at unbeatable prices. Your premium shopping experience awaits.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            {['⚡ Fast Delivery', '🔒 Secure Payments', '🎁 Best Deals'].map(f => (
              <span key={f} style={{
                padding: '8px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                background: 'hsla(248,89%,66%,0.1)', border: '1px solid hsla(248,89%,66%,0.2)', color: 'hsl(248,89%,72%)',
              }}>{f}</span>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div style={{
          width: '100%', maxWidth: 480,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '40px 44px',
          margin: '0 auto',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '18px', margin: '0 auto 18px',
              background: 'linear-gradient(135deg, hsl(248,89%,66%), hsl(270,80%,68%))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#fff', fontSize: 32,
              boxShadow: '0 10px 32px hsla(248,89%,66%,0.4)',
            }}>S</div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800, color: 'hsl(220,25%,94%)', letterSpacing: '-0.02em' }}>
              Sign in to <span style={{ background: 'linear-gradient(135deg,hsl(248,89%,70%),hsl(270,80%,72%))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ShopEZ</span>
            </h1>
            <p style={{ color: 'hsl(220,15%,55%)', marginTop: 8, fontSize: 15 }}>Enter your credentials to continue</p>
          </div>

          {/* Card */}
          <div style={{
            background: 'hsla(240,12%,12%,0.8)',
            border: '1px solid hsla(248,50%,70%,0.12)',
            borderRadius: 20,
            padding: 32,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}>
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Password</span>
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(248,89%,70%)', fontSize: 12, fontWeight: 600, padding: 0 }}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12, marginTop: 4 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Signing in...
                  </span>
                ) : '→ Sign In'}
              </button>
            </form>

            <div className="divider">or continue with</div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="filled_black"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="370"
              />
            </div>

            <p style={{ textAlign: 'center', marginTop: 22, color: 'hsl(220,15%,55%)', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'hsl(248,89%,70%)', fontWeight: 600, textDecoration: 'none' }}>
                Create one →
              </Link>
            </p>

            {/* Demo hint */}
            <div style={{
              marginTop: 20, padding: '12px 16px',
              background: 'hsla(248,89%,66%,0.07)',
              border: '1px solid hsla(248,89%,66%,0.15)',
              borderRadius: 10, fontSize: 13, color: 'hsl(220,15%,55%)',
              textAlign: 'center',
            }}>
              <strong style={{ color: 'hsl(248,89%,70%)' }}>Demo:</strong> admin@shopez.com / admin123
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
