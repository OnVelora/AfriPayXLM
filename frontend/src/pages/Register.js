import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/register', form);
            localStorage.setItem('token', data.token);
            navigate('/');
        }
        catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    }
    return (_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }, children: _jsxs("div", { className: "card", style: { width: '100%', maxWidth: '400px' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '2rem' }, children: [_jsx("div", { style: { fontSize: '2rem' }, children: "\u26A1" }), _jsx("h1", { style: { fontSize: '1.5rem', fontWeight: 700 }, children: "Create Account" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [['name', 'email', 'password'].map((field) => (_jsxs("div", { className: "form-group", children: [_jsx("label", { children: field.charAt(0).toUpperCase() + field.slice(1) }), _jsx("input", { type: field === 'password' ? 'password' : field === 'email' ? 'email' : 'text', value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }), required: true })] }, field))), error && _jsx("p", { className: "error", children: error }), _jsx("button", { className: "btn btn-primary", style: { width: '100%', marginTop: '0.5rem' }, type: "submit", children: "Create Account" })] }), _jsxs("p", { style: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }, children: ["Have an account? ", _jsx(Link, { to: "/login", children: "Sign in" })] })] }) }));
}
