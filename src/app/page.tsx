'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Camera, Search, ArrowRight, ShieldCheck, Zap, QrCode, Download, Image as ImageIcon, Users, Cloud } from 'lucide-react';
import { getAllEvents } from '@/lib/db';
import { EventItem } from '@/lib/types';
import EventCard from '@/components/EventCard';

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllEvents();
      setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '90px 0 60px',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          
          {/* Top Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '24px' }}>
            <Sparkles size={14} color="#06b6d4" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
              Next-Gen AI Photo Cloud for Event Photographers
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: '1.1',
            maxWidth: '960px',
            margin: '0 auto 24px',
          }}>
            Never ask <span className="gradient-text">&quot;Please send photos&quot;</span> ever again.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
          }}>
            Upload 200+ high-resolution photos per event. Guests scan a QR code, snap a 1-second selfie, and our AI instantly finds and downloads every single photo they appear in.
          </p>

          {/* Search & Code Finder Bar */}
          <div style={{
            maxWidth: '580px',
            margin: '0 auto 48px',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glow)',
            boxShadow: 'var(--shadow-glow)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 8px 6px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <Search size={20} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search event name, location, or wedding..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById('events-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              <span>Explore</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            padding: '20px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="#06b6d4" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Instant AI Search</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.5s facial matching</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Download size={20} color="#a855f7" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Zero Compression</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Original print-ready quality</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cloud size={20} color="#10b981" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Cloud CDN Storage</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-speed global delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3-Step Flow */}
      <section style={{ padding: '60px 0', background: 'rgba(13, 17, 26, 0.6)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-ai" style={{ marginBottom: '12px' }}>Simple & Effortless</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>How EventLens Works</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {/* Step 1 */}
            <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                marginBottom: '20px',
              }}>
                <Camera size={24} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-violet)', marginBottom: '8px' }}>STEP 01</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Photographer Bulk Uploads</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Drop 200+ raw high-res photos into the event manager. The AI automatically indexes all faces in the background.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                marginBottom: '20px',
              }}>
                <QrCode size={24} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>STEP 02</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Guests Scan QR Code</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Place the printable QR code on tables or screens. Guests scan with their phone camera to open the live gallery.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.15)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f472b6',
                marginBottom: '20px',
              }}>
                <Sparkles size={24} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f472b6', marginBottom: '8px' }}>STEP 03</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Snap Selfie & Download</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Guest takes a quick selfie. The AI instantly filters every photo they appear in for 1-click lossless download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Events Section */}
      <section id="events-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-event" style={{ marginBottom: '8px' }}>Live Galleries</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore Event Galleries</h2>
            </div>

            <Link href="/admin?new=true" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              <Camera size={16} />
              <span>Create Event Gallery</span>
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading event galleries...
            </div>
          ) : filteredEvents.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px',
            }}>
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <ImageIcon size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No events found</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Try searching for a different keyword or create a new event gallery.
              </p>
              <Link href="/admin?new=true" className="btn-primary">
                Create Event Now
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
