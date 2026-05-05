import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        }
        catch {
            setError('Invalid email or password');
        }
    }
    return (_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }, children: _jsxs("div", { className: "card", style: { width: '100%', maxWidth: '400px' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '2rem' }, children: [_jsx("div", { style: { fontSize: '2rem' }, children: "\u26A1" }), _jsx("h1", { style: { fontSize: '1.5rem', fontWeight: 700 }, children: "AfriPayXLM" }), _jsx("p", { style: { color: 'var(--muted)', fontSize: '0.9rem' }, children: "Sign in to your merchant account" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), error && _jsx("p", { className: "error", children: error }), _jsx("button", { className: "btn btn-primary", style: { width: '100%', marginTop: '0.5rem' }, type: "submit", children: "Sign In" })] }), _jsxs("p", { style: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }, children: ["No account? ", _jsx(Link, { to: "/register", children: "Register" })] })] }) }));
}
