import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Get user_id from localStorage
const getUserId = () => {
  return localStorage.getItem("user_id") || "";
};

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
    const user_id = getUserId();
    if (!user_id) {
      navigate('/');
      return;
    }
    
    try {
      const response = await axios.get(`http://127.0.0.1:5000/profile/${user_id}`);
      if (response.data && !response.data.error) {
        setUser(response.data);
        setEditForm({
          role: response.data.role || '',
          domain: Array.isArray(response.data.domain) 
            ? response.data.domain.join(', ') 
            : (response.data.domain || ''),
          interests: Array.isArray(response.data.interests) 
            ? response.data.interests.join(', ') 
            : (response.data.interests || ''),
          preference: response.data.preference || ''
        });
      } else {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(localUser);
        setEditForm({
          role: localUser.role || '',
          domain: Array.isArray(localUser.domain)
            ? localUser.domain.join(', ')
            : (localUser.domain || ''),
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
        domain: Array.isArray(localUser.domain)
          ? localUser.domain.join(', ')
          : (localUser.domain || ''),
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
    const user_id = getUserId();
    
    try {
      const interestsArray = editForm.interests
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const domainArray = editForm.domain
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const updatedProfile = {
        ...user,
        role: editForm.role,
        domain: domainArray,
        interests: interestsArray,
        preference: editForm.preference
      };

      const response = await axios.post(`http://127.0.0.1:5000/profile/${user_id}`, updatedProfile);
      
      if (response.data && !response.data.error) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        setUser(updatedProfile);
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }
      
      setEditing(false);
      navigate('/home');
    } catch (err) {
      const interestsArray = editForm.interests
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const domainArray = editForm.domain
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const updatedProfile = {
        ...user,
        role: editForm.role,
        domain: domainArray,
        interests: interestsArray,
        preference: editForm.preference
      };
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setEditing(false);
      navigate('/home');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('This will reset all your data and start fresh. Continue?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      localStorage.removeItem('clicks');
      navigate('/');
    }
  };

  // Generate AI Summary
  const generateAISummary = () => {
    const domains = Array.isArray(user?.domain) ? user.domain : [];
    const interests = Array.isArray(user?.interests) ? user.interests : [];
    const allTopics = [...domains, ...interests].filter(Boolean);
    
    if (allTopics.length === 0) {
      return "Complete your profile to get personalized recommendations.";
    }
    
    const topicText = allTopics.slice(0, 3).join(', ');
    const prefText = user?.preference === 'Quick updates' 
      ? 'quick updates and bite-sized content'
      : user?.preference === 'Deep insights'
      ? 'in-depth analysis and comprehensive insights'
      : 'balanced content across topics';
    
    return `You're interested in ${topicText}. You prefer ${prefText}. We'll curate the best content from ET ecosystem to match your preferences.`;
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
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <div style={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div style={styles.headerText}>
            <h1 style={styles.userName}>{user?.name || 'Anonymous'}</h1>
            {user?.role && <span style={styles.roleBadge}>{user.role}</span>}
          </div>
        </div>
        <div style={styles.headerActions}>
          {!editing && (
            <button 
              style={styles.editBtn}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.grid}>
        {/* Left Column */}
        <div style={styles.column}>
          {/* About You Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>About You</h3>
            </div>
            <div style={styles.cardContent}>
              {editing ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Role</label>
                    <select
                      style={styles.formSelect}
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
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Domain</label>
                    <input
                      style={styles.formInput}
                      type="text"
                      value={editForm.domain}
                      onChange={(e) => setEditForm({...editForm, domain: e.target.value})}
                      placeholder="e.g., Technology, Finance..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Name</span>
                    <span style={styles.infoValue}>{user?.name || 'Not provided'}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Role</span>
                    <span style={styles.infoValue}>{user?.role || 'Not provided'}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Domain</span>
                    <span style={styles.infoValue}>
                      {Array.isArray(user?.domain) && user.domain.length > 0 
                        ? user.domain.join(', ') 
                        : 'Not provided'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Interests Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Your Interests</h3>
            </div>
            <div style={styles.cardContent}>
              {editing ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Interests (comma separated)</label>
                    <input
                      style={styles.formInput}
                      type="text"
                      value={editForm.interests}
                      onChange={(e) => setEditForm({...editForm, interests: e.target.value})}
                      placeholder="e.g., Markets, Technology, Crypto..."
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Content Preference</label>
                    <select
                      style={styles.formSelect}
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
                <>
                  <div style={styles.tagsContainer}>
                    {Array.isArray(user?.interests) && user.interests.length > 0 ? (
                      user.interests.map((interest, idx) => (
                        <span key={idx} style={styles.interestTag}>{interest}</span>
                      ))
                    ) : (
                      <span style={styles.emptyText}>No interests added yet</span>
                    )}
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Preference</span>
                    <span style={styles.infoValue}>{user?.preference || 'Not set'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.column}>
          {/* AI Summary Card */}
          <div style={styles.aiCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>AI Summary</h3>
              <span style={styles.aiBadge}>Personalized</span>
            </div>
            <div style={styles.cardContent}>
              <p style={styles.aiSummaryText}>{generateAISummary()}</p>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Your Activity</h3>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>
                  {Array.isArray(user?.interests) ? user.interests.length : 0}
                </span>
                <span style={styles.statLabel}>Interests</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>
                  {Array.isArray(user?.domain) ? user.domain.length : 0}
                </span>
                <span style={styles.statLabel}>Domains</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>∞</span>
                <span style={styles.statLabel}>Content</span>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Quick Actions</h3>
            </div>
            <div style={styles.cardContent}>
              {editing ? (
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.primaryBtn} 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    style={styles.secondaryBtn} 
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={styles.actionButtons}>
                  <button style={styles.primaryBtn} onClick={() => navigate('/home')}>
                    Go to Home
                  </button>
                  <button style={styles.dangerBtn} onClick={handleReset}>
                    Reset Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '24px 32px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '16px',
    color: '#6b7280',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    padding: '24px 28px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    width: 'fit-content',
  },
  headerActions: {},
  editBtn: {
    padding: '10px 20px',
    background: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  aiCard: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  aiBadge: {
    padding: '4px 10px',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
  },
  cardContent: {
    padding: '20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  interestTag: {
    padding: '6px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  aiSummaryText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#6b7280',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    padding: '20px',
  },
  statItem: {
    textAlign: 'center',
    padding: '14px',
    background: '#f9fafb',
    borderRadius: '8px',
  },
  statNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '700',
    color: '#ef4444',
  },
  statLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: '16px',
  },
  formLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: '500',
  },
  formInput: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  },
  formSelect: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryBtn: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    background: '#ef4444',
    color: '#fff',
    transition: 'all 0.15s ease',
  },
  secondaryBtn: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    background: '#f3f4f6',
    color: '#374151',
    transition: 'background 0.15s ease',
  },
  dangerBtn: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    background: '#fff',
    color: '#6b7280',
    transition: 'all 0.15s ease',
  },
};

export default Profile;
