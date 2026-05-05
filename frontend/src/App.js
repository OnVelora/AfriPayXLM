import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import PaymentPage from './pages/PaymentPage';
import Settings from './pages/Settings';
function PrivateRoute({ children }) {
    const { merchant } = useAuth();
    return merchant ? children : _jsx(Navigate, { to: "/login", replace: true });
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/pay/:id", element: _jsx(PaymentPage, {}) }), _jsxs(Route, { path: "/", element: _jsx(PrivateRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "payments", element: _jsx(Payments, {}) }), _jsx(Route, { path: "settings", element: _jsx(Settings, {}) })] })] }));
}
