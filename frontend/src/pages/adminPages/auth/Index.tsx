// src/pages/adminPages/auth/AdminLogin.tsx
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from "lucide-react";
import { adminAuthService } from "@/services/adminAuth.service";
import { useAdminAuthContext } from "@/providers/AdminAuthProvider";
import { AdminLoginRequest } from "@/types/authAdmin-types";

const AdminLogin = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    checkAuth,
    login: contextLogin,
  } = useAdminAuthContext(); // ✅ Use context login
  const [formData, setFormData] = useState<AdminLoginRequest>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Debug environment variables
  useEffect(() => {
    console.log("🔧 Admin Login Debug:", {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
      currentURL: window.location.href,
    });

    // ✅ FIXED: Force auth check on login page load
    console.log("🔄 AdminLogin: Checking existing auth...");
    const authResult = checkAuth();
    console.log("🔄 AdminLogin auth result:", authResult);

    // If authenticated, redirect
    if (authResult) {
      console.log("✅ Already authenticated, redirecting to dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate, checkAuth]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📝 Admin Login Form Submission:", {
      email: formData.email,
      passwordLength: formData.password.length,
      timestamp: new Date().toISOString(),
    });

    if (!validateForm()) {
      console.log("❌ Form validation failed:", formErrors);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("🚀 Attempting admin login...");
      await contextLogin(formData); // ✅ Use context login instead
      console.log("✅ Admin login successful");

      // Navigate handled by context login function
    } catch (err: any) {
      console.error("❌ Admin login failed:", err);
      setError(err.message || "Login gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // ✅ TAMBAHAN: Clear session handler
  const handleClearSession = async () => {
    try {
      console.log("🧹 Clearing admin session...");
      await adminAuthService.forceClearSession();
      
      // Force reload page to clear any cached data
      window.location.reload();
    } catch (error) {
      console.error("❌ Error clearing session:", error);
      // Force clear locally even if server call fails
      adminAuthService.clearAuthData();
      window.location.reload();
    }
  };

  // ✅ FIXED: Redirect check using context state
  if (isAuthenticated) {
    console.log(
      "✅ Already authenticated via context, redirecting to dashboard"
    );
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Admin Panel</h2>
          <p className="mt-2 text-blue-100">Masuk ke panel administrasi</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Global Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="admin@example.com"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/"
              className="block text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              ← Kembali ke Website Utama
            </Link>
            
            {/* ✅ TAMBAHAN: Clear Session Button */}
            <button
              type="button"
              onClick={handleClearSession}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
            >
              Bersihkan Data Login (jika bermasalah)
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center space-y-2">
          <p className="text-blue-100 text-xs">
            Halaman ini hanya untuk administrator yang berwenang.
            <br />
            Semua aktivitas akan dicatat untuk keamanan.
          </p>
          
          {/* ✅ TAMBAHAN: Default Credentials (untuk development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-blue-800 bg-opacity-50 rounded-lg text-blue-100 text-xs">
              <p className="font-semibold mb-1">🔑 Kredensial Default:</p>
              <p>Email: admin@example.com</p>
              <p>Password: SuperAdmin123!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
