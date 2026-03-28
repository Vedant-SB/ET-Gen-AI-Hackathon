import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import SectionPage from './SectionPage';
import DetailPage from './DetailPage';
import Sidebar from './Sidebar';

// Layout component with sidebar
function AppLayout({ children }) {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <main style={{ 
        flex: 1, 
        marginLeft: showSidebar ? '240px' : 0,
        minHeight: '100vh'
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
        {/* Chat/Onboarding - No sidebar */}
        <Route path="/" element={<Chat />} />
        
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
