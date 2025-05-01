// src/services/auth.js
import { useEffect, useState, createContext, useContext } from 'react';

// Constants
const CLIENT_ID = '477653231572-bbf1hj129rsn78uks60s9ennau5siunc.apps.googleusercontent.com';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly'
];

// Create a context for auth state
const AuthContext = createContext(null);

// Secure token storage helper functions
const secureStorage = {
  setTokens: (tokens) => {
    localStorage.setItem('family_portal_tokens', JSON.stringify(tokens));
  },
  getTokens: () => {
    const tokens = localStorage.getItem('family_portal_tokens');
    return tokens ? JSON.parse(tokens) : null;
  },
  clearTokens: () => {
    localStorage.removeItem('family_portal_tokens');
  }
};

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Google Identity Services
  useEffect(() => {
    const loadGoogleIdentity = async () => {
      try {
        // Load the Google Identity Services script
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

        // Check for existing tokens and validate
        const existingTokens = secureStorage.getTokens();
        if (existingTokens && new Date(existingTokens.expiresAt) > new Date()) {
          // Token exists and is not expired
          fetchUserInfo(existingTokens.access_token);
        } else if (existingTokens && existingTokens.refresh_token) {
          // Token expired but we have refresh token
          refreshAccessToken(existingTokens.refresh_token);
        } else {
          // No valid tokens
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    loadGoogleIdentity();
  }, []);

  // Fetch user information with valid token
  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userData = await response.json();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to fetch user information');
      secureStorage.clearTokens();
      setLoading(false);
    }
  };

  // Refresh an expired access token
  const refreshAccessToken = async (refreshToken) => {
    try {
      // In a real implementation, you would call your backend to handle the refresh
      // For security, refresh token operations should not be done client-side
      console.error('Token refresh should be implemented on a backend service');
      secureStorage.clearTokens();
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing token:', error);
      setError('Failed to refresh authentication');
      secureStorage.clearTokens();
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize Google Sign-In
      if (!window.google || !window.google.accounts) {
        throw new Error('Google Identity Services not loaded');
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            throw new Error(tokenResponse.error);
          }

          // Calculate expiration time
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + tokenResponse.expires_in);

          // Store tokens securely
          secureStorage.setTokens({
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            expiresAt: expiresAt.toISOString()
          });

          // Fetch user information
          await fetchUserInfo(tokenResponse.access_token);
        }
      });

      client.requestAccessToken();
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in');
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    secureStorage.clearTokens();
    setUser(null);
  };

  // Get valid access token for API requests
  const getAccessToken = async () => {
    const tokens = secureStorage.getTokens();
    
    if (!tokens) {
      throw new Error('No authentication tokens found');
    }

    if (new Date(tokens.expiresAt) > new Date()) {
      // Token is still valid
      return tokens.access_token;
    } else if (tokens.refresh_token) {
      // Token expired, try to refresh
      await refreshAccessToken(tokens.refresh_token);
      return secureStorage.getTokens()?.access_token;
    } else {
      // No refresh token, need to re-authenticate
      throw new Error('Authentication expired');
    }
  };

  // Helper function to make authenticated API requests
  const fetchWithAuth = async (url, options = {}) => {
    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      if (error.message.includes('Authentication expired')) {
        // If token is expired and we couldn't refresh, sign out
        signOut();
      }
      throw error;
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        signIn, 
        signOut, 
        fetchWithAuth,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default { AuthProvider, useAuth };