'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, Eye, QrCode, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { getEventById, getPhotosByEventId } from '@/lib/db';
import { EventItem, PhotoItem } from '@/lib/types';
import BulkUploader from '@/components/BulkUploader';
import QRCodeModal from '@/components/QRCodeModal';

export default function EventBulkUploadPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadSuccessCount, setUploadSuccessCount] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    if (!eventId) return;
    setLoading(true);
    const evt = await getEventById(eventId);
    if (evt) {
      setEvent(evt);
      const photoList = await getPhotosByEventId(evt.id);
      setPhotos(photoList);
    }
    setLoading(false);
  };

  const handleUploadComplete = async (uploadedCount: number) => {
    setUploadSuccessCount(uploadedCount);
    await loadData();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px', color: '#6366f1' }} />
        <p>Loading Event Upload Manager...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Event Not Found</h2>
        <Link href="/admin" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowQR(true)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <QrCode size={16} />
              <span>Get Event QR Code</span>
            </button>

            <Link
              href={`/event/${event.slug || event.id}`}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Eye size={16} />
              <span>View Public Gallery</span>
            </Link>
          </div>
        </div>

        {/* Event Header Banner */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-event">{event.category}</span>
              <span className="badge badge-ai"><Sparkles size={11} /> AI Indexing Ready</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>
              {event.title}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {event.location} • {new Date(event.date).toLocaleDateString()} • {photos.length} Photos in Gallery
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
              {photos.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Photos Indexed</div>
          </div>
        </div>

        {/* Upload Success Alert */}
        {uploadSuccessCount !== null && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399' }}>
              <CheckCircle2 size={22} />
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Successfully uploaded and AI indexed {uploadSuccessCount} photos!
              </span>
            </div>

            <Link
              href={`/event/${event.slug || event.id}`}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <span>Test AI Search in Live Gallery</span>
            </Link>
          </div>
        )}

        {/* Bulk Uploader Module */}
        <BulkUploader eventId={event.id} onUploadComplete={handleUploadComplete} />

        {/* Currently Uploaded Photos Grid */}
        {photos.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Existing Event Photos ({photos.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px',
            }}>
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  style={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    aspectRatio: '1 / 1',
                    background: '#0e131f',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <img
                    src={p.thumbnailUrl || p.url}
                    alt={p.title || `Photo ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {p.faces && p.faces.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.7)',
                      borderRadius: '12px',
                      padding: '2px 6px',
                      fontSize: '0.65rem',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}>
                      <Sparkles size={9} /> {p.faces.length} faces
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showQR && <QRCodeModal event={event} onClose={() => setShowQR(false)} />}
    </div>
  );
}
