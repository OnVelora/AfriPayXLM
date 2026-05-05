import { useState, useEffect } from 'react';
import api from '../api';
import CreatePaymentModal from '../components/CreatePaymentModal';

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  function load() {
    api.get(`/payments?page=${page}&limit=20${status ? `&status=${status}` : ''}`)
      .then(({ data }) => { setPayments(data.payments); setPages(data.pages); });
  }

  useEffect(load, [page, status]);

  function copyLink(link: string) { navigator.clipboard.writeText(link); }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Payments</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={{ width: 'auto' }}>
            <option value="">All Status</option>
            {['PENDING', 'COMPLETED', 'EXPIRED', 'FAILED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Payment</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Amount</th><th>Local</th><th>Status</th><th>Tx Hash</th><th>Date</th><th>Link</th></tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>No payments found</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.id.slice(0, 8)}…</td>
                <td>{p.amount} USDC</td>
                <td>{p.localAmount} {p.localCurrency}</td>
                <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {p.txHash ? `${p.txHash.slice(0, 10)}…` : '—'}
                </td>
                <td style={{ color: 'var(--muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  {p.paymentLink && (
                    <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => copyLink(p.paymentLink)}>Copy</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span style={{ padding: '0.6rem', color: 'var(--muted)' }}>{page} / {pages}</span>
          <button className="btn btn-outline" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {showCreate && <CreatePaymentModal onClose={() => { setShowCreate(false); load(); }} />}
    </div>
  );
}
