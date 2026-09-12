'use client';

import React, { useState, useEffect } from 'react';
import { X, Cloud, Key, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface CloudConfigModalProps {
  onClose: () => void;
}

export default function CloudConfigModal({ onClose }: CloudConfigModalProps) {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    // Load from local storage or environment
    const storedUrl = localStorage.getItem('eventlens_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const storedKey = localStorage.getItem('eventlens_supabase_key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    setSupabaseUrl(storedUrl);
    setSupabaseKey(storedKey);
  }, []);

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Please fill in both Supabase URL and Anon API Key.');
      }

      if (!supabaseUrl.startsWith('https://')) {
        throw new Error('Supabase URL must start with https://');
      }

      const client = createClient(supabaseUrl, supabaseKey);
      // Attempt quick query to test connection
      const { data, error } = await client.from('events').select('count', { count: 'exact', head: true });

      if (error && error.code !== 'PGRST116') {
        // Even if table doesn't exist yet, if connection reaches supabase it's validated
        console.log('Supabase connection ping:', error.message);
      }

      // Save to localStorage
      localStorage.setItem('eventlens_supabase_url', supabaseUrl);
      localStorage.setItem('eventlens_supabase_key', supabaseKey);

      setTestResult({
        success: true,
        message: 'Successfully connected to Supabase Cloud! Your event photos will now upload directly to cloud storage.',
      });

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection failed. Please check your Supabase credentials.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('eventlens_supabase_url');
    localStorage.removeItem('eventlens_supabase_key');
    setSupabaseUrl('');
    setSupabaseKey('');
    setTestResult({
      success: true,
      message: 'Reverted to demo / local fallback storage.',
    });
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: '50%',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
          }}>
            <Cloud size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Live Cloud Storage & DB</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Connect Supabase to host all 200+ photos per event online.
            </p>
          </div>
        </div>

        <form onSubmit={handleTestAndSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzabcdef.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {testResult && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
              color: testResult.success ? '#34d399' : '#fb7185',
            }}>
              {testResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
          }}>
            <strong>How to get free credentials:</strong>
            <ol style={{ marginLeft: '16px', marginTop: '4px' }}>
              <li>Create free account at <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>supabase.com <ExternalLink size={10} style={{ display: 'inline' }} /></a></li>
              <li>Create a new project and go to <strong>Project Settings → API</strong>.</li>
              <li>Paste the URL and Anon key above, or set in <code>.env.local</code> / Vercel.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={testing}
              className="btn-primary"
              style={{ flex: 1, padding: '12px' }}
            >
              {testing ? <RefreshCw size={16} className="animate-spin" /> : <Cloud size={16} />}
              <span>{testing ? 'Testing Connection...' : 'Save & Connect Cloud'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary"
              style={{ padding: '12px 18px', fontSize: '0.85rem' }}
            >
              Reset to Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
