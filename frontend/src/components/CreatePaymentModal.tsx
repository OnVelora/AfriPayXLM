import { useState, FormEvent } from 'react';
import api from '../api';

const CURRENCIES = ['USD', 'NGN', 'KES', 'GHS', 'ZAR', 'UGX', 'TZS', 'ETB', 'XOF', 'EUR', 'GBP'];

interface Props { onClose: () => void }

export default function CreatePaymentModal({ onClose }: Props) {
  const [form, setForm] = useState({ amount: '', localCurrency: 'USD', description: '' });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/payments/create', {
        amount: parseFloat(form.amount),
        localCurrency: form.localCurrency,
        description: form.description || undefined,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create payment');
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">Create Payment Link</h2>

        {!result ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (USDC)</label>
              <input type="number" step="0.01" min="0.01" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Local Currency</label>
              <select value={form.localCurrency} onChange={(e) => setForm({ ...form, localCurrency: e.target.value })}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            {error && <p className="error">{error}</p>}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{result.amount} USDC</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>≈ {result.localAmount} {result.localCurrency}</div>
            </div>

            <div className="form-group">
              <label>Payment Link</label>
              <div className="copy-box">
                <span style={{ flex: 1, fontSize: '0.8rem' }}>{result.paymentLink}</span>
                <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }}
                  onClick={() => copy(result.paymentLink, 'link')}>
                  {copied === 'link' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Stellar Address</label>
              <div className="copy-box" style={{ fontSize: '0.8rem' }}>{result.stellarAddress}</div>
            </div>

            <div className="form-group">
              <label>Memo (required)</label>
              <div className="copy-box" style={{ borderColor: 'var(--warning)' }}>
                <span style={{ flex: 1, fontWeight: 700, color: 'var(--warning)' }}>{result.memo}</span>
                <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }}
                  onClick={() => copy(result.memo, 'memo')}>
                  {copied === 'memo' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
