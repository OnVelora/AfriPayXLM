import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
export default function PaymentPage() {
    const { id } = useParams();
    const [payment, setPayment] = useState(null);
    const [copied, setCopied] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        api.get(`/payments/status/${id}`)
            .then(({ data }) => setPayment(data))
            .catch(() => setError('Payment not found'));
        // Poll for status updates
        const interval = setInterval(() => {
            api.get(`/payments/status/${id}`).then(({ data }) => {
                setPayment(data);
                if (data.status !== 'PENDING')
                    clearInterval(interval);
            });
        }, 15000);
        return () => clearInterval(interval);
    }, [id]);
    function copy(text, key) {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
    }
    if (error)
        return (_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }, children: _jsx("div", { className: "card", style: { textAlign: 'center' }, children: _jsx("p", { style: { color: 'var(--danger)' }, children: error }) }) }));
    if (!payment)
        return (_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }, children: _jsx("p", { style: { color: 'var(--muted)' }, children: "Loading\u2026" }) }));
    const statusColors = { PENDING: '#f59e0b', COMPLETED: '#22c55e', EXPIRED: '#ef4444', FAILED: '#ef4444' };
    return (_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }, children: _jsxs("div", { className: "card", style: { width: '100%', maxWidth: '480px' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '1.5rem' }, children: [_jsx("div", { style: { fontSize: '2rem' }, children: "\u26A1" }), _jsx("h1", { style: { fontSize: '1.3rem', fontWeight: 700 }, children: "AfriPayXLM" }), payment.description && _jsx("p", { style: { color: 'var(--muted)', marginTop: '0.3rem' }, children: payment.description })] }), _jsxs("div", { style: { background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '2.5rem', fontWeight: 700 }, children: [payment.amount, " ", _jsx("span", { style: { color: 'var(--primary)' }, children: "USDC" })] }), _jsxs("div", { style: { color: 'var(--muted)', fontSize: '0.9rem' }, children: ["\u2248 ", payment.localAmount, " ", payment.localCurrency, " (rate: ", payment.fxRate, ")"] })] }), _jsx("div", { style: { marginBottom: '1rem', padding: '0.8rem', background: `${statusColors[payment.status]}22`, borderRadius: 'var(--radius)', textAlign: 'center' }, children: _jsx("span", { style: { color: statusColors[payment.status], fontWeight: 600 }, children: payment.status === 'PENDING' ? '⏳ Awaiting Payment' : payment.status === 'COMPLETED' ? '✅ Payment Confirmed' : `❌ ${payment.status}` }) }), payment.status === 'PENDING' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Send USDC to this Stellar address" }), _jsxs("div", { className: "copy-box", children: [_jsx("span", { style: { flex: 1 }, children: payment.stellarAddress }), _jsx("button", { className: "btn btn-outline", style: { padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }, onClick: () => copy(payment.stellarAddress, 'addr'), children: copied === 'addr' ? 'Copied!' : 'Copy' })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "\u26A0\uFE0F Required Memo (must include this)" }), _jsxs("div", { className: "copy-box", style: { borderColor: 'var(--warning)' }, children: [_jsx("span", { style: { flex: 1, fontWeight: 700, color: 'var(--warning)' }, children: payment.memo }), _jsx("button", { className: "btn btn-outline", style: { padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }, onClick: () => copy(payment.memo, 'memo'), children: copied === 'memo' ? 'Copied!' : 'Copy' })] }), _jsx("p", { style: { fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.4rem' }, children: "You MUST include this memo or your payment cannot be matched." })] })] })), payment.status === 'COMPLETED' && payment.txHash && (_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Transaction Hash" }), _jsx("div", { className: "copy-box", children: _jsx("a", { href: `https://stellar.expert/explorer/testnet/tx/${payment.txHash}`, target: "_blank", rel: "noreferrer", style: { flex: 1, fontSize: '0.8rem' }, children: payment.txHash }) })] })), _jsx("p", { style: { textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem' }, children: "Powered by AfriPayXLM \u00B7 Stellar USDC" })] }) }));
}
