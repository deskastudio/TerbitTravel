// src/components/partials/adminPartials/adminProtect/Index.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthContext } from '@/providers/AdminAuthProvider';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireSuperAdmin?: boolean;
}

const AdminProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'super-admin'],
  requireSuperAdmin = false 
}: AdminProtectedRouteProps) => {
  const { isAuthenticated, admin, loading, checkAuth } = useAdminAuthContext();
  const location = useLocation();

  // ✅ FIXED: Force auth check on mount if not authenticated but localStorage has data
  React.useEffect(() => {
    if (!isAuthenticated && !loading) {
      console.log('🔄 AdminProtectedRoute: Forcing auth check');
      const authResult = checkAuth();
      console.log('🔄 Auth check result:', authResult);
    }
  }, [isAuthenticated, loading, checkAuth]);

  console.log('🔐 AdminProtectedRoute Check:', {
    isAuthenticated,
    admin: admin ? { 
      id: admin._id, 
      email: admin.email, 
      role: admin.role,
      name: admin.name 
    } : null,
    loading,
    allowedRoles,
    requireSuperAdmin,
    currentPath: location.pathname,
    // ✅ Add localStorage debug info
    localStorageState: {
      hasToken: !!localStorage.getItem('adminToken'),
      hasUser: !!localStorage.getItem('adminUser'),
      tokenExpired: (() => {
        const exp = localStorage.getItem('adminTokenExpiration');
        return exp ? Date.now() > parseInt(exp) : true;
      })()
    }
  });

  // ✅ Show loading while checking auth
  if (loading) {
    console.log('⏳ Still loading, showing loader...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // ✅ Redirect to login if not authenticated
  if (!isAuthenticated || !admin) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // ✅ Check super admin requirement
  if (requireSuperAdmin && admin.role !== 'super-admin') {
    console.log('❌ Super admin required, access denied');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600">Super admin access required</p>
            <p className="text-sm text-gray-500 mt-2">Your role: {admin.role}</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(admin.role) && admin.role !== 'super-admin') {
    console.log('❌ Role not allowed, access denied');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600">Insufficient permissions</p>
            <p className="text-sm text-gray-500 mt-2">Your role: {admin.role}</p>
            <p className="text-sm text-gray-500">Required: {allowedRoles.join(', ')}</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Access granted for admin:', admin.email, 'Role:', admin.role);
  return <>{children}</>;
};

export default AdminProtectedRoute;