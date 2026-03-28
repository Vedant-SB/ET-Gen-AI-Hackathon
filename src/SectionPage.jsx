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
  industry: 'Industry',
};

function SectionPage() {
  const { type } = useParams();
  const items = getItemsBySection(type);
  const title = sectionTitles[type] || type;

  // Get top 3 as "recommended"
  const recommended = items.slice(0, 3);
  const allItems = items;

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>
          {items.length} items available
        </p>
      </div>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🔥 Recommended</h2>
          <div style={styles.recommendedGrid}>
            {recommended.map((item) => (
              <Card key={item.id} item={item} size="large" />
            ))}
          </div>
        </section>
      )}

      {/* All Items */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>All {title}</h2>
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
    background: '#f8f9fc',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '24px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 20px',
  },
  recommendedGrid: {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
};

export default SectionPage;
