import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, Shield, Heart, Zap, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.95)',
      marginTop: '80px',
      padding: '48px 0 24px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '40px',
        }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Camera size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Event<span className="gradient-text">Lens</span> AI
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              The high-performance AI event photo distribution cloud. Replace messy WhatsApp groups with instant, high-res AI face recognition photo matching.
            </p>
          </div>

          {/* Col 2: Features */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color="#06b6d4" /> AI "Find My Photos" Selfie Match
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={14} color="#a855f7" /> 200+ Photo Bulk Cloud Uploader
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={14} color="#10b981" /> QR-Code Instant Venue Access
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={14} color="#f59e0b" /> Original High-Res Lossless Downloads
              </li>
            </ul>
          </div>

          {/* Col 3: Cloud & Hosting */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>Cloud Ready</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '12px' }}>
              Engineered for seamless 1-click deployment to <strong>Vercel</strong> and <strong>Supabase</strong> with 0$ start costs.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-count" style={{ fontSize: '0.75rem' }}>Next.js 14</span>
              <span className="badge badge-count" style={{ fontSize: '0.75rem' }}>Supabase Cloud</span>
              <span className="badge badge-count" style={{ fontSize: '0.75rem' }}>TensorFlow / WebGL</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)',
        }}>
          <div>© {new Date().getFullYear()} EventLens AI Platform. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built for professional event companies with precision & care.
          </div>
        </div>
      </div>
    </footer>
  );
}
