import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth(); // we can't update context directly easily without a function, wait, we can just fetch and reload or use the token.
  // Actually, updating the profile returns a new token and user details!
  
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', city: '', postalCode: '', country: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
          country: data.country || ''
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
      // Update local storage with new token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setMessage('Profile updated successfully! 🎉');
      setForm({ ...form, password: '' }); // Clear password field
      window.location.reload(); // Reload to update auth context
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>👤 My Profile</h1>

      <div className="card">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>Basic Info</div>
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
            <label>New Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current password" />
          </div>

          <div className="section-title" style={{ fontSize: 18, marginBottom: 16, marginTop: 32 }}>Shipping Details</div>
          <div className="form-group">
            <label>Address</label>
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 16 }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
