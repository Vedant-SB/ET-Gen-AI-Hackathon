import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import SectionPage from './SectionPage';
import DetailPage from './DetailPage';
import Sidebar from './Sidebar';

// Get or generate user_id
const getUserId = () => {
  let user_id = localStorage.getItem("user_id");
  if (!user_id) {
    user_id = crypto.randomUUID();
    localStorage.setItem("user_id", user_id);
  }
  return user_id;
};

// Initial route check component
function InitialRoute() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user_id = getUserId();
      try {
        // Check if profile exists (not just user_id)
        const response = await axios.get(`http://127.0.0.1:5000/profile/${user_id}`);
        if (response.data && !response.data.error && response.data.name) {
          // User has completed profile, go to home
          navigate('/home', { replace: true });
        } else {
          // User exists but no profile data, start onboarding
          setChecking(false);
        }
      } catch (err) {
        // 404 or error means new user, show chat onboarding
        console.error('Error checking user:', err);
        setChecking(false);
      }
    };
    checkUser();
  }, [navigate]);

  if (checking) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f8f9fc 0%, #e8ebf2 100%)',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return <Chat />;
}

// Layout component with sidebar
function AppLayout({ children }) {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 60;

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
      )}
      <main style={{ 
        flex: 1, 
        marginLeft: showSidebar ? `${sidebarWidth}px` : 0,
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease'
      }}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Initial route - checks user and redirects */}
        <Route path="/" element={<InitialRoute />} />
        
        {/* Main app routes with sidebar */}
        <Route path="/home" element={
          <AppLayout><Home /></AppLayout>
        } />
        <Route path="/profile" element={
          <AppLayout><Profile /></AppLayout>
        } />
        <Route path="/section/:type" element={
          <AppLayout><SectionPage /></AppLayout>
        } />
        <Route path="/item/:id" element={
          <AppLayout><DetailPage /></AppLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
