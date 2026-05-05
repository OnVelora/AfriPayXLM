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

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div>
      <h1 className="page-title">Settings</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>API Credentials</h2>
        <div className="form-group">
          <label>API Key</label>
          <div className="copy-box">
            <span style={{ flex: 1 }}>{merchant?.apiKey}</span>
            <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }}
              onClick={() => copy(merchant?.apiKey || '', 'apiKey')}>
              {copied === 'apiKey' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
            Use this key in the <code>X-Api-Key</code> header for API requests.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Webhook</h2>
        <div className="form-group">
          <label>Webhook URL</label>
          <input
            type="url"
            placeholder="https://yoursite.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
            AfriPayXLM will POST to this URL when a payment is confirmed.
          </p>
        </div>
        <button className="btn btn-primary" onClick={saveWebhook}>{saved ? '✓ Saved' : 'Save Webhook URL'}</button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Account</h2>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div><span style={{ color: 'var(--muted)' }}>Name: </span>{merchant?.name}</div>
          <div><span style={{ color: 'var(--muted)' }}>Email: </span>{merchant?.email}</div>
        </div>
      </div>
    </div>
  );
}
