import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TABS = ['Basic Info', 'Shipping'];

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', city: '', postalCode: '', country: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setForm({
          name: data.name || '',
          email: data.email || '',
          password: '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: data.country || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { data } = await api.put('/auth/profile', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setMessage('Profile updated successfully!');
      setForm({ ...form, password: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = form.name ? form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="page" style={{ maxWidth: 680, animation: 'fadeIn 0.35s ease' }}>
      {/* Profile header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 22, marginBottom: 32,
        padding: '24px 28px',
        background: 'hsla(240,12%,12%,0.75)',
        border: '1px solid hsla(248,50%,70%,0.09)',
        borderRadius: 20,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(248,89%,66%), hsl(270,80%,68%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#fff', fontSize: 28,
          border: '3px solid hsla(248,89%,70%,0.3)',
          boxShadow: '0 8px 24px hsla(248,89%,66%,0.3)',
          flexShrink: 0,
        }}>{initials}</div>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.01em' }}>
            {form.name || 'Your Profile'}
          </h1>
          <p style={{ color: 'hsl(220,15%,55%)', fontSize: 14 }}>{form.email}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="badge badge-purple">
            {user?.role === 'admin' ? '⚡ Admin' : '🛍️ Shopper'}
          </span>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: 'hsl(240,12%,10%)', padding: 5, borderRadius: 12, width: 'fit-content' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{
              padding: '9px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              background: activeTab === i ? 'linear-gradient(135deg,hsl(248,89%,66%),hsl(270,80%,68%))' : 'transparent',
              color: activeTab === i ? '#fff' : 'hsl(220,15%,55%)',
              transition: 'all 0.2s',
              boxShadow: activeTab === i ? '0 4px 12px hsla(248,89%,66%,0.3)' : 'none',
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div style={{
        background: 'hsla(240,12%,12%,0.75)',
        border: '1px solid hsla(248,50%,70%,0.09)',
        borderRadius: 20, padding: 32,
        backdropFilter: 'blur(12px)',
      }}>
        {message && <div className="alert alert-success">✅ {message}</div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {activeTab === 0 ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(220,10%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Basic Information
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 xxxxx xxxxx" />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>New Password</span>
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(248,89%,70%)', fontSize: 12, fontWeight: 600, padding: 0 }}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current password" />
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(220,10%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Shipping Details
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input type="text" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12, marginTop: 8 }}
            disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Updating...
              </span>
            ) : '💾 Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
