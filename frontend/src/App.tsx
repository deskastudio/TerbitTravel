// src/App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import MainRoutes from './routes/MainRoutes';

// ✅ Import AdminAuthProvider
import AdminAuthProvider from '@/providers/AdminAuthProvider';

function App() {
  console.log('🚀 App.tsx rendered');
  
  return (
    <Router>
      {/* ✅ PERBAIKAN: AdminAuthProvider membungkus SEMUA routes admin */}
      <AdminAuthProvider>
        <AdminRoutes />
      </AdminAuthProvider>
      
      {/* ✅ MainRoutes tetap terpisah (menggunakan AuthProvider dari main.tsx) */}
      <MainRoutes />
    </Router>
  );
}

export default App;