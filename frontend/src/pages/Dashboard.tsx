import { useState, useEffect } from 'react';
import api from '../api';
import CreatePaymentModal from '../components/CreatePaymentModal';

interface Stats { total: number; completed: number; pending: number; volume: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0, volume: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    api.get('/payments?limit=5').then(({ data }) => {
      setRecent(data.payments);
      const completed = data.payments.filter((p: any) => p.status === 'COMPLETED');
      setStats({
        total: data.total,
        completed: completed.length,
        pending: data.payments.filter((p: any) => p.status === 'PENDING').length,
        volume: completed.reduce((s: number, p: any) => s + p.amount, 0),
      });
    });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Payment</button>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Payments', value: stats.total },
          { label: 'Completed', value: stats.completed },
          { label: 'Pending', value: stats.pending },
          { label: 'Volume (USDC)', value: stats.volume.toFixed(2) },
        ].map(({ label, value }) => (
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Payments</h2>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>No payments yet. Create your first payment link.</p>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Amount</th><th>Currency</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.id.slice(0, 8)}…</td>
                  <td>{p.amount} USDC</td>
                  <td>{p.localCurrency}</td>
                  <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && <CreatePaymentModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
