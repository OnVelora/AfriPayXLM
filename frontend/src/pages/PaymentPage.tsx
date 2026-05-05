import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<any>(null);
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
        if (data.status !== 'PENDING') clearInterval(interval);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ textAlign: 'center' }}><p style={{ color: 'var(--danger)' }}>{error}</p></div>
    </div>
  );

  if (!payment) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--muted)' }}>Loading…</p>
    </div>
  );

  const statusColors: Record<string, string> = { PENDING: '#f59e0b', COMPLETED: '#22c55e', EXPIRED: '#ef4444', FAILED: '#ef4444' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>⚡</div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>AfriPayXLM</h1>
          {payment.description && <p style={{ color: 'var(--muted)', marginTop: '0.3rem' }}>{payment.description}</p>}
        </div>

        <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{payment.amount} <span style={{ color: 'var(--primary)' }}>USDC</span></div>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>≈ {payment.localAmount} {payment.localCurrency} (rate: {payment.fxRate})</div>
        </div>

        <div style={{ marginBottom: '1rem', padding: '0.8rem', background: `${statusColors[payment.status]}22`, borderRadius: 'var(--radius)', textAlign: 'center' }}>
          <span style={{ color: statusColors[payment.status], fontWeight: 600 }}>
            {payment.status === 'PENDING' ? '⏳ Awaiting Payment' : payment.status === 'COMPLETED' ? '✅ Payment Confirmed' : `❌ ${payment.status}`}
          </span>
        </div>

        {payment.status === 'PENDING' && (
          <>
            <div className="form-group">
              <label>Send USDC to this Stellar address</label>
              <div className="copy-box">
                <span style={{ flex: 1 }}>{payment.stellarAddress}</span>
                <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }}
                  onClick={() => copy(payment.stellarAddress, 'addr')}>
                  {copied === 'addr' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>⚠️ Required Memo (must include this)</label>
              <div className="copy-box" style={{ borderColor: 'var(--warning)' }}>
                <span style={{ flex: 1, fontWeight: 700, color: 'var(--warning)' }}>{payment.memo}</span>
                <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }}
                  onClick={() => copy(payment.memo, 'memo')}>
                  {copied === 'memo' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.4rem' }}>
                You MUST include this memo or your payment cannot be matched.
              </p>
            </div>
          </>
        )}

        {payment.status === 'COMPLETED' && payment.txHash && (
          <div className="form-group">
            <label>Transaction Hash</label>
            <div className="copy-box">
              <a href={`https://stellar.expert/explorer/testnet/tx/${payment.txHash}`} target="_blank" rel="noreferrer"
                style={{ flex: 1, fontSize: '0.8rem' }}>{payment.txHash}</a>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem' }}>
          Powered by AfriPayXLM · Stellar USDC
        </p>
      </div>
    </div>
  );
}
