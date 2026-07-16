import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', 'hsl(0,90%,62%)', 'hsl(38,95%,55%)', 'hsl(150,80%,48%)'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'hsl(240,15%,6%)',
      backgroundImage: 'radial-gradient(ellipse 70% 60% at 100% 0%, hsla(270,70%,60%,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, hsla(248,80%,55%,0.1) 0%, transparent 55%)',
      padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '18px', margin: '0 auto 18px',
            background: 'linear-gradient(135deg, hsl(248,89%,66%), hsl(270,80%,68%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#fff', fontSize: 32,
            boxShadow: '0 10px 32px hsla(248,89%,66%,0.4)',
          }}>S</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800, color: 'hsl(220,25%,94%)', letterSpacing: '-0.02em' }}>
            Join <span style={{ background: 'linear-gradient(135deg,hsl(248,89%,70%),hsl(270,80%,72%))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ShopEZ</span>
          </h1>
          <p style={{ color: 'hsl(220,15%,55%)', marginTop: 8, fontSize: 15 }}>Create your account and start shopping today</p>
        </div>

        <div style={{
          background: 'hsla(240,12%,12%,0.8)',
          border: '1px solid hsla(248,50%,70%,0.12)',
          borderRadius: 20, padding: 32,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
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
              <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 99,
                        background: i <= strength ? strengthColors[strength] : 'hsl(240,12%,18%)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: strengthColors[strength], fontWeight: 600, textAlign: 'right' }}>
                    {strengthLabels[strength]}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12, marginTop: 8 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Creating Account...
                </span>
              ) : '✨ Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 22, color: 'hsl(220,15%,55%)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'hsl(248,89%,70%)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
