import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SectionRow from './SectionRow';
import etLogo from './assets/et-logo.png';
import { events, masterclasses, markets, prime, trending, wealth, startups, technology } from './data';

// Get user_id from localStorage
const getUserId = () => {
  return localStorage.getItem("user_id") || "";
};

// Domain expansion map for smarter recommendations
const domainMap = {
  finance: ["markets", "wealth", "business", "investing", "stocks", "banking"],
  technology: ["tech", "startups", "ai", "software", "digital", "innovation"],
  marketing: ["business", "startups", "digital", "growth", "branding"],
  business: ["markets", "startups", "finance", "leadership", "strategy"],
  investing: ["markets", "wealth", "stocks", "finance", "portfolio"],
  startups: ["technology", "business", "entrepreneurship", "innovation", "funding"],
  healthcare: ["pharma", "medtech", "health", "wellness"],
  education: ["learning", "skills", "edtech", "career"],
  careers: ["jobs", "skills", "leadership", "professional"],
};

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [hoveredAction, setHoveredAction] = useState(null);

  // Fetch profile every time Home loads (including after profile updates)
  useEffect(() => {
    fetchProfile();
  }, [location.key]);

  const fetchProfile = async () => {
    setLoading(true);
    const user_id = getUserId();
    if (!user_id) {
      navigate('/');
      return;
    }
    
    try {
      const response = await axios.get(`http://127.0.0.1:5000/profile/${user_id}`);
      if (response.data && !response.data.error) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        setRecommended(getRecommendedItems(response.data));
      } else {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(localUser);
        setRecommended(getRecommendedItems(localUser));
      }
    } catch (err) {
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(localUser);
      setRecommended(getRecommendedItems(localUser));
    } finally {
      setLoading(false);
    }
  };

  // Expand domains using the domain map for broader matching
  const expandDomains = (domains) => {
    if (!domains || !Array.isArray(domains)) return [];
    return domains.flatMap(d => {
      const key = d.toLowerCase();
      return domainMap[key] ? [d, ...domainMap[key]] : [d];
    });
  };

  // Get recommended items with expanded domain matching
  const getRecommendedItems = (userData) => {
    if (!userData?.interests && !userData?.domain) {
      return [...prime.slice(0, 3), ...markets.slice(0, 2), ...masterclasses.slice(0, 1)];
    }
    
    const allItems = [...prime, ...markets, ...masterclasses, ...events, ...wealth, ...startups, ...technology];
    
    // Build search terms with domain expansion
    let searchTerms = [];
    if (userData?.interests && Array.isArray(userData.interests)) {
      searchTerms = [...searchTerms, ...userData.interests];
    }
    if (userData?.domain && Array.isArray(userData.domain)) {
      const expandedDomains = expandDomains(userData.domain);
      searchTerms = [...searchTerms, ...expandedDomains];
    }
    
    // Score items based on relevance
    const scoredItems = allItems.map(item => {
      const itemText = `${item.category || ''} ${item.tags?.join(' ') || ''} ${item.title || ''} ${item.description || ''}`.toLowerCase();
      let score = 0;
      searchTerms.forEach(term => {
        if (itemText.includes(term.toLowerCase())) {
          score += term.length > 4 ? 2 : 1;
        }
      });
      return { item, score };
    });
    
    // Sort by score and return top items
    const sorted = scoredItems
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.item);
    
    if (sorted.length >= 6) {
      return sorted.slice(0, 6);
    } else if (sorted.length > 0) {
      const remaining = allItems.filter(i => !sorted.includes(i)).slice(0, 6 - sorted.length);
      return [...sorted, ...remaining];
    }
    return [...prime.slice(0, 2), ...markets.slice(0, 2), ...masterclasses.slice(0, 2)];
  };

  const displayName = user?.name || 'Explorer';
  
  // Get user interests for display text
  const getUserInterestsText = () => {
    const parts = [];
    if (user?.domain && Array.isArray(user.domain) && user.domain.length > 0) {
      parts.push(...user.domain.slice(0, 2));
    }
    if (user?.interests && Array.isArray(user.interests) && user.interests.length > 0) {
      parts.push(...user.interests.slice(0, 2));
    }
    return parts.length > 0 ? parts.slice(0, 3).join(', ') : 'your preferences';
  };

  // Quick action handlers with icons
  const quickActions = [
    { label: 'Explore Markets', path: '/section/markets', icon: '📊' },
    { label: 'Attend Events', path: '/section/events', icon: '📅' },
    { label: 'Learn Skills', path: '/section/masterclasses', icon: '🎓' },
    { label: 'Discover Startups', path: '/section/startups', icon: '🚀' },
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading your personalized feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <section style={styles.headerSection}>
        <div style={styles.headerContent}>
          <div style={styles.logoRow}>
            <img src={etLogo} alt="Economic Times" style={styles.headerLogo} />
            <span style={styles.logoText}>The Economic Times</span>
          </div>
          <h1 style={styles.headerTitle}>Welcome back, {displayName}</h1>
          <p style={styles.headerSubtitle}>
            Your personalized gateway to the Economic Times ecosystem
          </p>
          {user?.role && (
            <span style={styles.roleBadge}>{user.role}</span>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <div style={styles.quickActionsContainer}>
        <span style={styles.quickActionsLabel}>Quick Actions</span>
        <div style={styles.quickActionsRow}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              style={{
                ...styles.quickActionBtn,
                ...(hoveredAction === index ? styles.quickActionBtnHover : {}),
              }}
              onClick={() => navigate(action.path)}
              onMouseEnter={() => setHoveredAction(index)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <span style={styles.quickActionIcon}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div style={styles.content}>
        {/* Personalized Recommendations */}
        <div style={styles.recommendedSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{displayName}, here's what you should explore today</h2>
            <p style={styles.sectionSubtitle}>
              Based on your interests in {getUserInterestsText()}
            </p>
          </div>
          <SectionRow 
            items={recommended} 
            sectionKey="prime"
            showViewAll={true}
            hideTitle={true}
          />
        </div>

        {/* Trending Now */}
        <SectionRow 
          title="Trending Now" 
          items={trending.slice(0, 4)} 
          sectionKey="trending"
        />

        {/* Events Preview */}
        <SectionRow 
          title="Upcoming Events" 
          items={events.slice(0, 4)} 
          sectionKey="events"
        />

        {/* Explore More */}
        <div style={styles.exploreMoreSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Explore More</h2>
            <p style={styles.sectionSubtitle}>
              Discover content across different categories
            </p>
          </div>
          <SectionRow 
            items={[
              ...wealth.slice(0, 2),
              ...technology.slice(0, 2),
              ...startups.slice(0, 2)
            ]} 
            sectionKey="wealth"
            showViewAll={false}
            hideTitle={true}
          />
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
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
  },
  headerSection: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '32px 24px',
  },
  headerContent: {
    maxWidth: '1200px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  headerLogo: {
    height: '32px',
    objectFit: 'contain',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
  },
  headerTitle: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0 0 16px',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    background: 'rgba(254, 226, 226, 0.8)',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
  },
  quickActionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px 24px',
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
  },
  quickActionsLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  quickActionsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s ease',
  },
  quickActionBtnHover: {
    background: '#fef2f2',
    borderColor: '#fecaca',
    color: '#dc2626',
  },
  quickActionIcon: {
    fontSize: '16px',
  },
  content: {
    padding: '32px 24px',
    maxWidth: '1400px',
  },
  recommendedSection: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    border: '1px solid #e5e7eb',
  },
  sectionHeader: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 6px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  exploreMoreSection: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '32px',
    border: '1px solid #e5e7eb',
  },
};

export default Home;
