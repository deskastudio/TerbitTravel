import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// HYBRID MODE: 
// 1. All images and API calls use localhost:5000
// 2. Only external callbacks (Midtrans, Google) use tunnel URL
console.log(`🚀 Starting application in ${import.meta.env.MODE} mode`);

// Log configuration for clarity
console.log('�️ Frontend URL:', import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173');
console.log('🔌 API URL (all API calls):', import.meta.env.VITE_API_URL || 'http://localhost:5000');
console.log('🖼️ Image URLs (always from local):', 'http://localhost:5000');

if (import.meta.env.VITE_USE_LOCALTUNNEL === 'true') {
  console.log('🚇 Tunnel URL (external callbacks only):', import.meta.env.VITE_TUNNEL_URL);
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);