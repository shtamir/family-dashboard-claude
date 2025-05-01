// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './services/auth';

// Import pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Import components
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Main app with routing
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');
  
  // Set text direction based on language
  useEffect(() => {
    // Hebrew uses RTL layout
    setDirection(i18n.language === 'he' ? 'rtl' : 'ltr');
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, direction]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`app-container ${direction}`}>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

// Main app component with providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;