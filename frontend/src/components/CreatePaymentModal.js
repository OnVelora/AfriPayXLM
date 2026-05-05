import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import api from '../api';
const CURRENCIES = ['USD', 'NGN', 'KES', 'GHS', 'ZAR', 'UGX', 'TZS', 'ETB', 'XOF', 'EUR', 'GBP'];
export default function CreatePaymentModal({ onClose }) {
    const [form, setForm] = useState({ amount: '', localCurrency: 'USD', description: '' });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/payments/create', {
                amount: parseFloat(form.amount),
                localCurrency: form.localCurrency,
                description: form.description || undefined,
            });
            setResult(data);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to create payment');
        }
    }
    function copy(text, key) {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
    }
    return (_jsx("div", { className: "modal-overlay", onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs("div", { className: "modal", children: [_jsx("h2", { className: "modal-title", children: "Create Payment Link" }), !result ? (_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Amount (USDC)" }), _jsx("input", { type: "number", step: "0.01", min: "0.01", value: form.amount, onChange: (e) => setForm({ ...form, amount: e.target.value }), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Local Currency" }), _jsx("select", { value: form.localCurrency, onChange: (e) => setForm({ ...form, localCurrency: e.target.value }), children: CURRENCIES.map((c) => _jsx("option", { value: c, children: c }, c)) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Description (optional)" }), _jsx("input", { type: "text", value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }) })] }), error && _jsx("p", { className: "error", children: error }), _jsxs("div", { style: { display: 'flex', gap: '0.75rem', marginTop: '1rem' }, children: [_jsx("button", { type: "button", className: "btn btn-outline", style: { flex: 1 }, onClick: onClose, children: "Cancel" }), _jsx("button", { type: "submit", className: "btn btn-primary", style: { flex: 1 }, children: "Create" })] })] })) : (_jsxs("div", { children: [_jsxs("div", { style: { background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '1.8rem', fontWeight: 700 }, children: [result.amount, " USDC"] }), _jsxs("div", { style: { color: 'var(--muted)', fontSize: '0.85rem' }, children: ["\u2248 ", result.localAmount, " ", result.localCurrency] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Payment Link" }), _jsxs("div", { className: "copy-box", children: [_jsx("span", { style: { flex: 1, fontSize: '0.8rem' }, children: result.paymentLink }), _jsx("button", { className: "btn btn-outline", style: { padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }, onClick: () => copy(result.paymentLink, 'link'), children: copied === 'link' ? 'Copied!' : 'Copy' })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Stellar Address" }), _jsx("div", { className: "copy-box", style: { fontSize: '0.8rem' }, children: result.stellarAddress })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Memo (required)" }), _jsxs("div", { className: "copy-box", style: { borderColor: 'var(--warning)' }, children: [_jsx("span", { style: { flex: 1, fontWeight: 700, color: 'var(--warning)' }, children: result.memo }), _jsx("button", { className: "btn btn-outline", style: { padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }, onClick: () => copy(result.memo, 'memo'), children: copied === 'memo' ? 'Copied!' : 'Copy' })] })] }), _jsx("button", { className: "btn btn-primary", style: { width: '100%' }, onClick: onClose, children: "Done" })] }))] }) }));
}
