import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Layout() {
    const { merchant, logout } = useAuth();
    return (_jsxs("div", { className: "layout", children: [_jsxs("aside", { className: "sidebar", children: [_jsx("div", { className: "sidebar-logo", children: "\u26A1 AfriPayXLM" }), _jsx(NavLink, { to: "/", end: true, className: ({ isActive }) => isActive ? 'active' : '', children: "Dashboard" }), _jsx(NavLink, { to: "/payments", className: ({ isActive }) => isActive ? 'active' : '', children: "Payments" }), _jsx(NavLink, { to: "/settings", className: ({ isActive }) => isActive ? 'active' : '', children: "Settings" }), _jsxs("div", { style: { marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }, children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }, children: merchant?.name }), _jsx("button", { className: "btn btn-outline", style: { width: '100%' }, onClick: logout, children: "Logout" })] })] }), _jsx("main", { className: "main", children: _jsx(Outlet, {}) })] }));
}
