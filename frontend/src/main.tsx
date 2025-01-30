import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    {/* <AuthProvider> */}
      <App />
      <Toaster />
    {/* </AuthProvider> */}
  </StrictMode>
);