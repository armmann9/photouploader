'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Image as ImageIcon, QrCode, ArrowRight, UploadCloud, Sparkles } from 'lucide-react';
import { EventItem } from '@/lib/types';
import QRCodeModal from './QRCodeModal';

interface EventCardProps {
  event: EventItem;
  isAdminView?: boolean;
}

export default function EventCard({ event, isAdminView = false }: EventCardProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <div className="glass-panel glass-panel-hover" style={{
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Cover Image */}
        <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
          <img
            src={event.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {/* Dark Overlay Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7, 9, 14, 0.95) 0%, rgba(7, 9, 14, 0.2) 60%, rgba(0,0,0,0) 100%)',
          }} />

          {/* Category Badge */}
          <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
            <span className="badge badge-event">
              {event.category || 'Event'}
            </span>
          </div>

          {/* QR Code quick trigger */}
          <button
            onClick={() => setShowQR(true)}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              transition: 'all 0.2s',
            }}
            title="View Event QR Code"
          >
            <QrCode size={18} />
          </button>

          {/* Photo Count badge */}
          <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-count" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: '#fff' }}>
              <ImageIcon size={13} color="#06b6d4" />
              <span>{event.photoCount || 0} Photos</span>
            </span>

            <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
              <Sparkles size={11} /> AI Ready
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', lineHeight: '1.3' }}>
              {event.title}
            </h3>
            {event.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {event.description}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="#a855f7" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              {event.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="#06b6d4" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              href={`/event/${event.slug || event.id}`}
              className="btn-primary"
              style={{ flex: 1, padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <span>View Gallery</span>
              <ArrowRight size={15} />
            </Link>

            {isAdminView ? (
              <Link
                href={`/admin/upload/${event.id}`}
                className="btn-secondary"
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                title="Bulk Upload 200+ Photos"
              >
                <UploadCloud size={16} />
              </Link>
            ) : (
              <button
                onClick={() => setShowQR(true)}
                className="btn-secondary"
                style={{ padding: '10px 14px' }}
                title="QR Code"
              >
                <QrCode size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {showQR && <QRCodeModal event={event} onClose={() => setShowQR(false)} />}
    </>
  );
}
