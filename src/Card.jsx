import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ item, size = 'medium' }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/item/${item.id}`);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80';

  // Category-specific meta rendering
  const renderCategoryMeta = () => {
    switch (item.category) {
      case 'markets':
        if (item.price && item.change) {
          const isPositive = item.trend === 'up' || item.change.startsWith('+');
          return (
            <div style={styles.metaRow}>
              <span style={styles.priceText}>{item.price}</span>
              <span style={{
                ...styles.changeText,
                color: isPositive ? '#16a34a' : '#dc2626',
              }}>
                {item.change}
              </span>
              {item.type && <span style={styles.typeText}>{item.type}</span>}
            </div>
          );
        }
        return null;

      case 'prime':
        if (item.readTime || item.contentType) {
          return (
            <div style={styles.metaRow}>
              <span style={styles.metaText}>
                {item.readTime && `${item.readTime} read`}
                {item.readTime && item.contentType && ' • '}
                {item.contentType}
              </span>
            </div>
          );
        }
        return null;

      case 'masterclasses':
        return (
          <div style={styles.metaRow}>
            {item.duration && <span style={styles.metaText}>{item.duration}</span>}
            {item.duration && item.level && <span style={styles.metaText}> • </span>}
            {item.level && (
              <span style={{
                ...styles.levelBadge,
                background: item.level === 'Beginner' ? '#dcfce7' : 
                           item.level === 'Intermediate' ? '#fef3c7' : '#fee2e2',
                color: item.level === 'Beginner' ? '#166534' : 
                       item.level === 'Intermediate' ? '#92400e' : '#991b1b',
              }}>
                {item.level}
              </span>
            )}
          </div>
        );

      case 'events':
        if (item.date || item.location) {
          return (
            <div style={styles.metaRow}>
              <span style={styles.metaText}>
                {item.date}
                {item.date && item.location && ' • '}
                {item.location}
              </span>
            </div>
          );
        }
        return null;

      case 'startups':
        if (item.funding || item.sector) {
          return (
            <div style={styles.metaRow}>
              {item.funding && <span style={styles.fundingBadge}>{item.funding}</span>}
              {item.sector && <span style={styles.metaText}>{item.sector}</span>}
            </div>
          );
        }
        return null;

      case 'technology':
        if (item.topic || item.impact) {
          return (
            <div style={styles.metaRow}>
              {item.topic && <span style={styles.topicBadge}>{item.topic}</span>}
              {item.impact && <span style={styles.metaText}>{item.impact}</span>}
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div 
      style={{
        ...styles.card,
        ...(size === 'large' ? styles.cardLarge : {}),
        ...(isHovered ? styles.cardHover : {}),
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div style={styles.imageContainer}>
        <img 
          src={imageError ? fallbackImage : (item.image || fallbackImage)}
          alt={item.title}
          style={{
            ...styles.image,
            ...(isHovered ? styles.imageHover : {}),
          }}
          onError={() => setImageError(true)}
        />
        <span style={styles.categoryBadge}>{item.category}</span>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title}>{item.title}</h3>
        <p style={styles.description}>{item.description}</p>
        
        {/* Category-specific meta info */}
        {renderCategoryMeta()}
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <span key={index} style={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    minWidth: '280px',
    maxWidth: '280px',
    background: '#ffffff',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    overflow: 'hidden',
  },
  cardLarge: {
    minWidth: '320px',
    maxWidth: '320px',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '160px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.2s ease',
  },
  imageHover: {
    transform: 'scale(1.03)',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '500',
    textTransform: 'uppercase',
    background: 'rgba(254, 226, 226, 0.9)',
    color: '#dc2626',
    borderRadius: '4px',
    backdropFilter: 'blur(4px)',
  },
  content: {
    padding: '16px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  description: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 12px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  priceText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  },
  changeText: {
    fontSize: '13px',
    fontWeight: '500',
  },
  typeText: {
    fontSize: '11px',
    color: '#6b7280',
    background: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  metaText: {
    fontSize: '12px',
    color: '#6b7280',
  },
  levelBadge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  fundingBadge: {
    fontSize: '11px',
    background: '#dbeafe',
    color: '#1d4ed8',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  topicBadge: {
    fontSize: '11px',
    background: '#f3e8ff',
    color: '#7c3aed',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  tagsContainer: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: '11px',
    color: '#6b7280',
    background: '#f3f4f6',
    padding: '2px 8px',
    borderRadius: '4px',
  },
};

export default Card;
