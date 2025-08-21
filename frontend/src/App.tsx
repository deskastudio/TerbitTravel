// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import MainRoutes from "./routes/MainRoutes";

// ✅ Import AdminAuthProvider
import AdminAuthProvider from "@/providers/AdminAuthProvider";

function App() {
  console.log("🚀 App.tsx rendered");

  return (
    <Router>
      <AdminAuthProvider>
        {/* FIXED: Wrap both route systems in a single Routes component */}
        <Routes>
          {/* Admin routes take priority */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Main routes for everything else */}
          <Route path="/*" element={<MainRoutes />} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
