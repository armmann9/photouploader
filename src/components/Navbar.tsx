'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Sparkles, PlusCircle, Globe, Cloud, ShieldCheck } from 'lucide-react';
import CloudConfigModal from './CloudConfigModal';
import { isCloudConfigured } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [cloudActive, setCloudActive] = useState(false);

  useEffect(() => {
    setCloudActive(isCloudConfigured());
  }, []);

  return (
    <>
      <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          
          {/* Brand Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}>
              <Camera size={22} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  Event<span className="gradient-text">Lens</span>
                </span>
                <span className="badge badge-ai" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  <Sparkles size={10} /> AI
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Smart Event Photo Cloud</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link 
              href="/"
              style={{
                color: pathname === '/' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 500,
                fontSize: '0.9rem',
                padding: '8px 14px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                background: pathname === '/' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              }}
            >
              Browse Events
            </Link>

            <Link 
              href="/admin"
              style={{
                color: pathname.startsWith('/admin') ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 500,
                fontSize: '0.9rem',
                padding: '8px 14px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                background: pathname.startsWith('/admin') ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              }}
            >
              Host / Admin Portal
            </Link>

            {/* Cloud Status Pill */}
            <button
              onClick={() => setShowConfigModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: cloudActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                border: `1px solid ${cloudActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                color: cloudActive ? '#34d399' : '#fbbf24',
                cursor: 'pointer',
              }}
              title="Click to configure Cloud Database & Storage"
            >
              <Cloud size={14} />
              <span>{cloudActive ? 'Cloud Live' : 'Demo / Local Mode'}</span>
            </button>

            {/* Create Event CTA */}
            <Link href="/admin?new=true" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              <PlusCircle size={16} />
              <span>Host Event</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Cloud Config Modal */}
      {showConfigModal && (
        <CloudConfigModal 
          onClose={() => {
            setShowConfigModal(false);
            setCloudActive(isCloudConfigured());
          }} 
        />
      )}
    </>
  );
}
