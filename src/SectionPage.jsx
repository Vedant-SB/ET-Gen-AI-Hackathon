import { useParams } from 'react-router-dom';
import Card from './Card';
import { getItemsBySection } from './data';

const sectionTitles = {
  events: 'Events',
  masterclasses: 'Masterclasses',
  markets: 'ET Markets',
  prime: 'ET Prime',
  trending: 'Trending',
  wealth: 'Wealth',
  startups: 'Startups',
  technology: 'Technology',
};

const sectionDescriptions = {
  events: 'Discover conferences, summits, and networking opportunities',
  masterclasses: 'Learn from industry experts and upgrade your skills',
  markets: 'Stay updated with stock markets, commodities, and forex',
  prime: 'Premium insights and in-depth analysis',
  trending: 'What everyone is reading right now',
  wealth: 'Personal finance, investments, and wealth management',
  startups: 'Startup ecosystem, funding news, and entrepreneurship',
  technology: 'Tech trends, innovations, and digital transformation',
};

const ctaLinks = {
  markets: { label: 'Explore ET Markets', url: 'https://economictimes.indiatimes.com/markets' },
  prime: { label: 'Explore ET Prime', url: 'https://economictimes.indiatimes.com/prime' },
  events: { label: 'Explore ET Events', url: 'https://b2b.economictimes.indiatimes.com/events' },
  masterclasses: { label: 'Explore ET Masterclass', url: 'https://masterclass.economictimes.indiatimes.com/' },
  wealth: { label: 'Explore ET Wealth', url: 'https://economictimes.indiatimes.com/wealth' },
  startups: { label: 'Explore ET Startups', url: 'https://economictimes.indiatimes.com/tech/startups' },
  technology: { label: 'Explore ET Tech', url: 'https://economictimes.indiatimes.com/tech' },
  trending: { label: 'Explore ET News', url: 'https://economictimes.indiatimes.com/' },
};

function SectionPage() {
  const { type } = useParams();
  const items = getItemsBySection(type);
  const title = sectionTitles[type] || type;
  const description = sectionDescriptions[type] || '';
  const cta = ctaLinks[type];

  // Get top 3 as "recommended"
  const recommended = items.slice(0, 3);
  // Get next 4 as "popular"
  const popular = items.slice(3, 7);
  // All items
  const allItems = items;

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.description}>{description}</p>
          <p style={styles.itemCount}>{items.length} items available</p>
        </div>
        {cta && (
          <a
            href={cta.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ctaButton}
          >
            {cta.label}
          </a>
        )}
      </div>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recommended</h2>
            <p style={styles.sectionSubtitle}>Top picks for you in this category</p>
          </div>
          <div style={styles.recommendedGrid}>
            {recommended.map((item) => (
              <Card key={item.id} item={item} size="large" />
            ))}
          </div>
        </section>
      )}

      {/* Popular Section */}
      {popular.length > 0 && (
        <section style={styles.sectionAlt}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Popular in {title}</h2>
            <p style={styles.sectionSubtitle}>Popular choices among users interested in this category</p>
          </div>
          <div style={styles.popularGrid}>
            {popular.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* All Items */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>All {title}</h2>
          <p style={styles.sectionSubtitle}>Browse the complete collection</p>
        </div>
        <div style={styles.grid}>
          {allItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '32px 24px',
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
  },
  headerLeft: {},
  title: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px',
  },
  description: {
    fontSize: '15px',
    color: '#6b7280',
    margin: '0 0 12px',
    maxWidth: '500px',
    lineHeight: '1.5',
  },
  itemCount: {
    fontSize: '13px',
    color: '#9ca3af',
    margin: 0,
  },
  ctaButton: {
    display: 'inline-block',
    padding: '12px 24px',
    background: '#ef4444',
    borderRadius: '8px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
  section: {
    padding: '32px 24px',
  },
  sectionAlt: {
    padding: '32px 24px',
    background: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
  },
  sectionHeader: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 6px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  recommendedGrid: {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  popularGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
};

export default SectionPage;
