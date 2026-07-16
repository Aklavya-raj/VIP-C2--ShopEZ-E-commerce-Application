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
      const { data } = await api.post('/auth/google', {
        credential: credentialResponse.credential
      });
      // Use same key as AuthContext so the app recognizes the logged-in user
      localStorage.setItem('shopez_user', JSON.stringify(data));
      window.location.href = '/';
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message || 'Unknown error';
      setError(`Google login failed: ${detail}`);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0e1a', padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '16px', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: '#fff', fontSize: 28
            }}>S</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#e2e8f0' }}>
              Shop<span style={{ color: '#6c63ff' }}>EZ</span>
            </h1>
            <p style={{ color: '#94a3b8', marginTop: 8 }}>Sign in to your account</p>
          </div>

          <div className="card">
            {error && <div className="alert alert-error">{error}</div>}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 8 }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#1e293b' }}></div>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#1e293b' }}></div>
            </div>

            {/* Google Sign-In — below Sign In button */}
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

            <p style={{ textAlign: 'center', marginTop: 20, color: '#94a3b8', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
            <div style={{ marginTop: 20, padding: '12px', background: 'rgba(108,99,255,0.08)', borderRadius: 8, fontSize: 13, color: '#94a3b8' }}>
              <strong style={{ color: '#6c63ff' }}>Demo:</strong> admin@shopez.com / admin123
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
