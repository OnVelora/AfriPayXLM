import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
export default function Settings() {
    const { merchant } = useAuth();
    const [webhookUrl, setWebhookUrl] = useState(merchant?.webhookUrl || '');
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState('');
    async function saveWebhook() {
        await api.patch('/auth/webhook-url', { webhookUrl });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }
    function copy(text, key) {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
    }
    return (_jsxs("div", { children: [_jsx("h1", { className: "page-title", children: "Settings" }), _jsxs("div", { className: "card", style: { marginBottom: '1.5rem' }, children: [_jsx("h2", { style: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }, children: "API Credentials" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "API Key" }), _jsxs("div", { className: "copy-box", children: [_jsx("span", { style: { flex: 1 }, children: merchant?.apiKey }), _jsx("button", { className: "btn btn-outline", style: { padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }, onClick: () => copy(merchant?.apiKey || '', 'apiKey'), children: copied === 'apiKey' ? 'Copied!' : 'Copy' })] }), _jsxs("p", { style: { fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.4rem' }, children: ["Use this key in the ", _jsx("code", { children: "X-Api-Key" }), " header for API requests."] })] })] }), _jsxs("div", { className: "card", style: { marginBottom: '1.5rem' }, children: [_jsx("h2", { style: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }, children: "Webhook" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Webhook URL" }), _jsx("input", { type: "url", placeholder: "https://yoursite.com/webhook", value: webhookUrl, onChange: (e) => setWebhookUrl(e.target.value) }), _jsx("p", { style: { fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.4rem' }, children: "AfriPayXLM will POST to this URL when a payment is confirmed." })] }), _jsx("button", { className: "btn btn-primary", onClick: saveWebhook, children: saved ? '✓ Saved' : 'Save Webhook URL' })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { style: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }, children: "Account" }), _jsxs("div", { style: { display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }, children: [_jsxs("div", { children: [_jsx("span", { style: { color: 'var(--muted)' }, children: "Name: " }), merchant?.name] }), _jsxs("div", { children: [_jsx("span", { style: { color: 'var(--muted)' }, children: "Email: " }), merchant?.email] })] })] })] }));
}
