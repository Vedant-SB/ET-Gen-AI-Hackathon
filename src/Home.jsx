import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionRow from './SectionRow';
import { events, masterclasses, markets, prime, trending } from './data';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(localUser);
  }, []);

  const displayName = user?.name || 'Explorer';
  const hasProfile = user?.name ? true : false;

  // Get recommended items based on user interests
  const getRecommended = () => {
    if (!user?.interests) return [...prime.slice(0, 3), ...markets.slice(0, 2)];
    
    const allItems = [...prime, ...markets, ...masterclasses, ...events];
    const userInterests = Array.isArray(user.interests) 
      ? user.interests.join(' ').toLowerCase()
      : (user.interests || '').toLowerCase();
    
    const matched = allItems.filter(item => 
      userInterests.includes(item.category) || 
      userInterests.includes(item.type || '')
    );
    
    return matched.length > 0 ? matched.slice(0, 5) : allItems.slice(0, 5);
  };

  return (
    <div style={styles.container}>
      {/* Banner for incomplete profile */}
      {!hasProfile && (
        <div style={styles.banner}>
          <p style={styles.bannerText}>
            🎯 Complete your profile for personalized recommendations
          </p>
          <button style={styles.bannerButton} onClick={() => navigate('/')}>
            Complete Profile
          </button>
        </div>
      )}

      {/* Welcome Section */}
      <section style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Welcome, {displayName} 👋</h1>
        <p style={styles.welcomeSubtitle}>
          Your personalized gateway to the Economic Times ecosystem
        </p>
      </section>

      {/* Content Sections */}
      <div style={styles.content}>
        {/* Recommended for You */}
        <SectionRow 
          title="Recommended for You" 
          items={getRecommended()} 
          sectionKey="prime"
          showViewAll={true}
        />

        {/* Trending Now */}
        <SectionRow 
          title="Trending Now" 
          items={trending} 
          sectionKey="trending"
        />

        {/* Events Preview */}
        <SectionRow 
          title="Upcoming Events" 
          items={events} 
          sectionKey="events"
        />

        {/* Masterclasses Preview */}
        <SectionRow 
          title="Popular Masterclasses" 
          items={masterclasses} 
          sectionKey="masterclasses"
        />

        {/* Markets Preview */}
        <SectionRow 
          title="Market Updates" 
          items={markets} 
          sectionKey="markets"
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fc',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  bannerText: {
    margin: 0,
    fontSize: '14px',
  },
  bannerButton: {
    padding: '8px 16px',
    background: '#fff',
    color: '#667eea',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  welcomeSection: {
    padding: '40px 24px 24px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  welcomeSubtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  content: {
    padding: '0 24px 40px',
  },
};

export default Home;
