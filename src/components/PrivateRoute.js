import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../utils/auth";

// 📌 Kullanıcı giriş yapmamışsa login sayfasına yönlendir
export const PrivateRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

// 📌 Admin yetkisini kontrol eden özel Route
export const AdminRoute = () => {
    return isAuthenticated() && isAdmin() ? <Outlet /> : <Navigate to="/unauthorized" />;
};
