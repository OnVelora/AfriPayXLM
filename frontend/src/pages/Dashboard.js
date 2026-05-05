import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import api from '../api';
import CreatePaymentModal from '../components/CreatePaymentModal';
export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, volume: 0 });
    const [recent, setRecent] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    useEffect(() => {
        api.get('/payments?limit=5').then(({ data }) => {
            setRecent(data.payments);
            const completed = data.payments.filter((p) => p.status === 'COMPLETED');
            setStats({
                total: data.total,
                completed: completed.length,
                pending: data.payments.filter((p) => p.status === 'PENDING').length,
                volume: completed.reduce((s, p) => s + p.amount, 0),
            });
        });
    }, []);
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }, children: [_jsx("h1", { className: "page-title", style: { margin: 0 }, children: "Dashboard" }), _jsx("button", { className: "btn btn-primary", onClick: () => setShowCreate(true), children: "+ New Payment" })] }), _jsx("div", { className: "stats-grid", children: [
                    { label: 'Total Payments', value: stats.total },
                    { label: 'Completed', value: stats.completed },
                    { label: 'Pending', value: stats.pending },
                    { label: 'Volume (USDC)', value: stats.volume.toFixed(2) },
                ].map(({ label, value }) => (_jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-label", children: label }), _jsx("div", { className: "stat-value", children: value })] }, label))) }), _jsxs("div", { className: "card", children: [_jsx("h2", { style: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }, children: "Recent Payments" }), recent.length === 0 ? (_jsx("p", { style: { color: 'var(--muted)', textAlign: 'center', padding: '2rem' }, children: "No payments yet. Create your first payment link." })) : (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Currency" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Date" })] }) }), _jsx("tbody", { children: recent.map((p) => (_jsxs("tr", { children: [_jsxs("td", { style: { fontFamily: 'monospace', fontSize: '0.8rem' }, children: [p.id.slice(0, 8), "\u2026"] }), _jsxs("td", { children: [p.amount, " USDC"] }), _jsx("td", { children: p.localCurrency }), _jsx("td", { children: _jsx("span", { className: `badge badge-${p.status.toLowerCase()}`, children: p.status }) }), _jsx("td", { style: { color: 'var(--muted)' }, children: new Date(p.createdAt).toLocaleDateString() })] }, p.id))) })] }))] }), showCreate && _jsx(CreatePaymentModal, { onClose: () => setShowCreate(false) })] }));
}
