
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import ReportIssue from "./pages/ReportIssue";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExploreReports from "./pages/ExploreReports";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRoute({ children, requiredRole }) {
    const token = localStorage.getItem("ecowatch_token");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("ecowatch_user"));
    } catch {
        user = null;
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return (
            <Navigate
                to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                replace
            />
        );
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/report"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <ReportIssue />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/explore-reports"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <ExploreReports />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
