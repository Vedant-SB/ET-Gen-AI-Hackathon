import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from './data';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = getItemById(id);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80';

  if (!item) {
    return (
      <div style={styles.container}>
        <div style={styles.notFound}>
          <h2>Item not found</h2>
          <p>The item you're looking for doesn't exist.</p>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const getActionText = () => {
    switch (item.category) {
      case 'events': return 'Register Now';
      case 'masterclasses': return 'Enroll Now';
      case 'markets': return 'View on ET Markets';
      case 'wealth': return 'Learn More';
      case 'startups': return 'Read Full Story';
      case 'technology': return 'Explore More';
      case 'prime': return 'Read on ET Prime';
      default: return 'Read More';
    }
  };

  // Render PRIME (Article View)
  const renderPrimeContent = () => (
    <div style={styles.contentSection}>
      <div style={styles.metaRow}>
        {item.readTime && <span style={styles.metaText}>{item.readTime} read</span>}
        {item.readTime && item.contentType && <span style={styles.metaDot}>•</span>}
        {item.contentType && <span style={styles.metaText}>{item.contentType}</span>}
      </div>
      <p style={styles.bodyText}>{item.description}</p>
      <p style={styles.bodyText}>
        Get exclusive insights and in-depth analysis from ET Prime's expert team, 
        curated to help you make informed decisions.
      </p>
    </div>
  );

  // Render MARKETS (Data + Insight)
  const renderMarketsContent = () => {
    const isPositive = item.trend === 'up' || (item.change && item.change.startsWith('+'));
    return (
      <div style={styles.contentSection}>
        <div style={styles.priceContainer}>
          {item.price && (
            <span style={styles.priceText}>{item.price}</span>
          )}
          {item.change && (
            <span style={{
              ...styles.changeText,
              color: isPositive ? '#16a34a' : '#dc2626',
            }}>
              {item.change}
            </span>
          )}
        </div>
        {item.type && (
          <div style={styles.typeRow}>
            <span style={styles.labelText}>Type:</span>
            <span style={styles.valueText}>{item.type}</span>
          </div>
        )}
        <p style={styles.bodyText}>{item.description}</p>
      </div>
    );
  };

  // Render MASTERCLASS (Course Page)
  const renderMasterclassContent = () => (
    <div style={styles.contentSection}>
      <div style={styles.courseMetaGrid}>
        {item.instructor && (
          <div style={styles.courseMetaItem}>
            <span style={styles.labelText}>Instructor</span>
            <span style={styles.valueText}>{item.instructor}</span>
          </div>
        )}
        {item.duration && (
          <div style={styles.courseMetaItem}>
            <span style={styles.labelText}>Duration</span>
            <span style={styles.valueText}>{item.duration}</span>
          </div>
        )}
        {item.level && (
          <div style={styles.courseMetaItem}>
            <span style={styles.labelText}>Level</span>
            <span style={{
              ...styles.levelBadge,
              background: item.level === 'Beginner' ? '#dcfce7' : 
                         item.level === 'Intermediate' ? '#fef3c7' : '#fee2e2',
              color: item.level === 'Beginner' ? '#166534' : 
                     item.level === 'Intermediate' ? '#92400e' : '#991b1b',
            }}>
              {item.level}
            </span>
          </div>
        )}
      </div>
      <p style={styles.bodyText}>{item.description}</p>
      <div style={styles.highlightsBox}>
        <h4 style={styles.highlightsTitle}>What you'll learn:</h4>
        <ul style={styles.highlightsList}>
          <li>Core concepts and fundamentals</li>
          <li>Practical frameworks and tools</li>
          <li>Real-world case studies</li>
        </ul>
      </div>
    </div>
  );

  // Render EVENTS (Event Page)
  const renderEventsContent = () => (
    <div style={styles.contentSection}>
      <div style={styles.eventMetaGrid}>
        {item.date && (
          <div style={styles.eventMetaItem}>
            <span style={styles.labelText}>Date</span>
            <span style={styles.valueText}>{item.date}</span>
          </div>
        )}
        {item.location && (
          <div style={styles.eventMetaItem}>
            <span style={styles.labelText}>Location</span>
            <span style={styles.valueText}>{item.location}</span>
          </div>
        )}
        {item.eventType && (
          <div style={styles.eventMetaItem}>
            <span style={styles.labelText}>Type</span>
            <span style={styles.valueText}>{item.eventType}</span>
          </div>
        )}
      </div>
      <p style={styles.bodyText}>{item.description}</p>
      <div style={styles.highlightsBox}>
        <h4 style={styles.highlightsTitle}>Who should attend:</h4>
        <ul style={styles.highlightsList}>
          <li>Industry professionals</li>
          <li>Business leaders and entrepreneurs</li>
          <li>Students and early-career professionals</li>
        </ul>
      </div>
    </div>
  );

  // Render STARTUPS
  const renderStartupsContent = () => (
    <div style={styles.contentSection}>
      <div style={styles.startupMetaRow}>
        {item.sector && (
          <span style={styles.sectorBadge}>{item.sector}</span>
        )}
        {item.funding && (
          <span style={styles.fundingBadge}>{item.funding}</span>
        )}
      </div>
      <p style={styles.bodyText}>{item.description}</p>
      <p style={styles.bodyText}>
        Stay updated on the latest startup trends, funding news, and 
        entrepreneurship insights from India's vibrant ecosystem.
      </p>
    </div>
  );

  // Render TECHNOLOGY
  const renderTechnologyContent = () => (
    <div style={styles.contentSection}>
      <div style={styles.techMetaRow}>
        {item.topic && (
          <div style={styles.techMetaItem}>
            <span style={styles.labelText}>Topic</span>
            <span style={styles.topicBadge}>{item.topic}</span>
          </div>
        )}
        {item.impact && (
          <div style={styles.techMetaItem}>
            <span style={styles.labelText}>Impact</span>
            <span style={styles.valueText}>{item.impact}</span>
          </div>
        )}
      </div>
      <p style={styles.bodyText}>{item.description}</p>
      <p style={styles.bodyText}>
        Explore how emerging technologies are reshaping industries 
        and creating new opportunities for businesses and professionals.
      </p>
    </div>
  );

  // Render DEFAULT
  const renderDefaultContent = () => (
    <div style={styles.contentSection}>
      <p style={styles.bodyText}>{item.description}</p>
      <p style={styles.bodyText}>
        Explore premium content curated by the Economic Times team 
        to help you stay informed and ahead.
      </p>
    </div>
  );

  // Select content renderer based on category
  const renderCategoryContent = () => {
    switch (item.category) {
      case 'prime': return renderPrimeContent();
      case 'markets': return renderMarketsContent();
      case 'masterclasses': return renderMasterclassContent();
      case 'events': return renderEventsContent();
      case 'startups': return renderStartupsContent();
      case 'technology': return renderTechnologyContent();
      default: return renderDefaultContent();
    }
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Hero Image */}
      <div style={styles.heroImageContainer}>
        <img 
          src={imageError ? fallbackImage : (item.image || fallbackImage)}
          alt={item.title}
          style={styles.heroImage}
          onError={() => setImageError(true)}
        />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <span style={styles.badge}>{item.category}</span>
          <h1 style={styles.heroTitle}>{item.title}</h1>
        </div>
      </div>

      {/* Content Card */}
      <div style={styles.card}>
        {/* Category-specific content */}
        {renderCategoryContent()}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={styles.tagsRow}>
            {item.tags.map((tag, index) => (
              <span key={index} style={styles.tagItem}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Primary Action Button */}
        <button 
          style={styles.actionBtn}
          onClick={() => window.open(item.link, '_blank')}
        >
          {getActionText()}
        </button>

        {/* Share Section */}
        <div style={styles.shareSection}>
          <span style={styles.shareLabel}>Share:</span>
          <button style={styles.shareBtn} onClick={() => navigator.clipboard.writeText(window.location.href)}>
            Copy Link
          </button>
          <button style={styles.shareBtn} onClick={() => window.open(`mailto:?subject=${item.title}&body=Check this out: ${window.location.href}`)}>
            Email
          </button>
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
    padding: '32px 40px',
  },
  notFound: {
    textAlign: 'center',
    padding: '80px 24px',
    color: '#6b7280',
  },
  backBtn: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
    transition: 'all 0.15s ease',
    color: '#374151',
  },
  heroImageContainer: {
    position: 'relative',
    width: '100%',
    height: '280px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
    border: '1px solid #e5e7eb',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
  },
  heroContent: {
    position: 'absolute',
    bottom: '24px',
    left: '24px',
    right: '24px',
  },
  heroTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#fff',
    margin: '10px 0 0',
    lineHeight: '1.3',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '28px 32px',
    border: '1px solid #e5e7eb',
  },
  badge: {
    display: 'inline-block',
    padding: '5px 12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#fff',
    borderRadius: '4px',
    background: '#ef4444',
  },
  contentSection: {
    marginBottom: '24px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '16px',
  },
  metaText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  metaDot: {
    color: '#9ca3af',
  },
  bodyText: {
    fontSize: '15px',
    color: '#4b5563',
    lineHeight: '1.7',
    margin: '0 0 12px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '12px',
  },
  priceText: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
  },
  changeText: {
    fontSize: '18px',
    fontWeight: '600',
  },
  typeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  labelText: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  valueText: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  courseMetaGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f3f4f6',
  },
  courseMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  levelBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '500',
    borderRadius: '4px',
  },
  eventMetaGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f3f4f6',
  },
  eventMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  startupMetaRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  sectorBadge: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#dbeafe',
    color: '#1d4ed8',
    borderRadius: '4px',
  },
  fundingBadge: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#dcfce7',
    color: '#166534',
    borderRadius: '4px',
  },
  techMetaRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '16px',
  },
  techMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  topicBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#f3e8ff',
    color: '#7c3aed',
    borderRadius: '4px',
  },
  highlightsBox: {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '16px 20px',
    marginTop: '16px',
    border: '1px solid #e5e7eb',
  },
  highlightsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 10px',
  },
  highlightsList: {
    margin: 0,
    paddingLeft: '18px',
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.8',
  },
  tagsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  tagItem: {
    fontSize: '13px',
    color: '#dc2626',
    fontWeight: '500',
  },
  actionBtn: {
    width: '100%',
    maxWidth: '320px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.15s ease',
  },
  shareSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  shareLabel: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  shareBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.15s ease',
    fontWeight: '500',
  },
};

export default DetailPage;
