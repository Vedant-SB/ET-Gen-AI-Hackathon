import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    role: '',
    domain: '',
    interests: '',
    preference: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/profile/test_user');
      if (response.data && !response.data.error) {
        setUser(response.data);
        setEditForm({
          role: response.data.role || '',
          domain: response.data.domain || '',
          interests: Array.isArray(response.data.interests) 
            ? response.data.interests.join(', ') 
            : (response.data.interests || ''),
          preference: response.data.preference || ''
        });
      } else {
        // Fallback to localStorage
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(localUser);
        setEditForm({
          role: localUser.role || '',
          domain: localUser.domain || '',
          interests: Array.isArray(localUser.interests)
            ? localUser.interests.join(', ')
            : (localUser.interests || ''),
          preference: localUser.preference || ''
        });
      }
    } catch (err) {
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(localUser);
      setEditForm({
        role: localUser.role || '',
        domain: localUser.domain || '',
        interests: Array.isArray(localUser.interests)
          ? localUser.interests.join(', ')
          : (localUser.interests || ''),
        preference: localUser.preference || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Parse interests string to array
      const interestsArray = editForm.interests
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const updatedProfile = {
        ...user,
        role: editForm.role,
        domain: editForm.domain,
        interests: interestsArray,
        preference: editForm.preference
      };

      const response = await axios.post('http://127.0.0.1:5000/profile/test_user', updatedProfile);
      
      if (response.data && !response.data.error) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        setUser(updatedProfile);
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }
      
      setEditing(false);
    } catch (err) {
      // Save to localStorage as fallback
      const interestsArray = editForm.interests
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const updatedProfile = {
        ...user,
        role: editForm.role,
        domain: editForm.domain,
        interests: interestsArray,
        preference: editForm.preference
      };
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('This will reset all your data. Continue?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('clicks');
      navigate('/');
    }
  };

  const formatInterests = (interests) => {
    if (Array.isArray(interests)) {
      return interests.join(', ');
    }
    return interests || 'Not provided';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Title */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Your Profile</h1>
      </div>

      {/* Profile Content */}
      <div style={styles.profileCard}>
        {/* Avatar */}
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <h2 style={styles.profileName}>{user?.name || 'Anonymous'}</h2>
          {user?.role && <span style={styles.badge}>{user.role}</span>}
        </div>

        {/* Details */}
        <div style={styles.detailsCard}>
          {editing ? (
            // Edit Mode
            <>
              <div style={styles.editItem}>
                <label style={styles.editLabel}>Role</label>
                <select
                  style={styles.editSelect}
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                >
                  <option value="">Select role...</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.editItem}>
                <label style={styles.editLabel}>Domain</label>
                <input
                  style={styles.editInput}
                  type="text"
                  value={editForm.domain}
                  onChange={(e) => setEditForm({...editForm, domain: e.target.value})}
                  placeholder="e.g., Technology, Finance..."
                />
              </div>

              <div style={styles.editItem}>
                <label style={styles.editLabel}>Interests (comma separated)</label>
                <input
                  style={styles.editInput}
                  type="text"
                  value={editForm.interests}
                  onChange={(e) => setEditForm({...editForm, interests: e.target.value})}
                  placeholder="e.g., Markets, Technology, Crypto..."
                />
              </div>

              <div style={styles.editItem}>
                <label style={styles.editLabel}>Preference</label>
                <select
                  style={styles.editSelect}
                  value={editForm.preference}
                  onChange={(e) => setEditForm({...editForm, preference: e.target.value})}
                >
                  <option value="">Select preference...</option>
                  <option value="Quick updates">Quick updates</option>
                  <option value="Deep insights">Deep insights</option>
                </select>
              </div>
            </>
          ) : (
            // View Mode
            <>
              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>👤</span>
                <div>
                  <span style={styles.label}>Name</span>
                  <span style={styles.value}>{user?.name || 'Not provided'}</span>
                </div>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>💼</span>
                <div>
                  <span style={styles.label}>Role</span>
                  <span style={styles.value}>{user?.role || 'Not provided'}</span>
                </div>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>🏢</span>
                <div>
                  <span style={styles.label}>Domain</span>
                  <span style={styles.value}>{user?.domain || 'Not provided'}</span>
                </div>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>⭐</span>
                <div>
                  <span style={styles.label}>Interests</span>
                  <span style={styles.value}>{formatInterests(user?.interests)}</span>
                </div>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>📖</span>
                <div>
                  <span style={styles.label}>Preference</span>
                  <span style={styles.value}>{user?.preference || 'Not provided'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          {editing ? (
            <>
              <button 
                style={styles.primaryBtn} 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button 
                style={styles.secondaryBtn} 
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button style={styles.primaryBtn} onClick={() => navigate('/home')}>
                Go to Home
              </button>
              <button style={styles.secondaryBtn} onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
              <button style={styles.dangerBtn} onClick={handleReset}>
                Reset Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fc',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '24px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666',
  },
  pageHeader: {
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  profileCard: {
    maxWidth: '500px',
  },
  avatarSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 auto 16px',
  },
  profileName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    background: '#e8f4fd',
    color: '#1976d2',
    borderRadius: '20px',
    fontSize: '14px',
  },
  detailsCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  detailIcon: {
    fontSize: '24px',
    marginRight: '16px',
    width: '32px',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#999',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  value: {
    display: 'block',
    fontSize: '16px',
    color: '#333',
    fontWeight: '500',
  },
  editItem: {
    marginBottom: '20px',
  },
  editLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
    fontWeight: '500',
  },
  editInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  editSelect: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryBtn: {
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  secondaryBtn: {
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    background: '#f0f0f5',
    color: '#333',
  },
  dangerBtn: {
    padding: '14px 24px',
    borderRadius: '12px',
    border: '2px solid #ffcdd2',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    background: '#fff',
    color: '#e53935',
  },
};

export default Profile;
