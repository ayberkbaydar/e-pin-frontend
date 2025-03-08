import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { PrivateRoute, AdminRoute } from "./components/PrivateRoute";

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    {/* Giriş Sayfası */}
                    <Route path="/login" element={<Login />} />

                    {/* Kullanıcı girişi gerektiren sayfa */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    {/* Admin girişi gerektiren sayfa */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>

                    {/* Yetkisiz erişim sayfası */}
                    <Route path="/unauthorized" element={<h2>Yetkisiz Erişim</h2>} />

                    {/* Varsayılan yönlendirme */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
