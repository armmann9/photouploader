/**
 * ============================================================================
 * EventLens AI — Guest Event Gallery Page (/event/[id]/page.tsx)
 * ============================================================================
 *
 * PURPOSE:
 *   This is the PRIMARY guest-facing page. When a guest scans the event QR code
 *   or opens the event link on their phone, THIS is the page they land on.
 *
 * FEATURES ON THIS PAGE:
 *   - Event banner hero with cover image, date, location, and photographer credit
 *   - "⚡ Find My Photos" AI face matcher button (opens FaceSearchModal)
 *   - Full responsive photo gallery grid with tag filters & batch downloads
 *   - Event QR code sharing modal
 *   - WhatsApp instant share button
 *   - PIN gate for private/protected events
 *   - Analytics tracking (page views, AI searches)
 *
 * DATA FLOW:
 *   1. URL param [id] → getEventById() → loads event metadata
 *   2. event.id → getPhotosByEventId() → loads all event photos
 *   3. Guest clicks AI → FaceSearchModal → returns FaceMatchResult[]
 *   4. Results filter GalleryGrid to show only matched photos
 *
 * CONNECTIONS:
 *   - db.ts        → getEventById(), getPhotosByEventId()
 *   - analytics.ts → trackPageView(), trackAISearch()
 *   - shareUtils.ts → shareViaWhatsApp()
 *   - Components  → GalleryGrid, FaceSearchModal, QRCodeModal, PinGate
 * ============================================================================
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Sparkles,
  Download,
  Share2,
  QrCode,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  X,
  FolderDown,
  Camera,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { getEventById, getPhotosByEventId } from '@/lib/db';
import { EventItem, PhotoItem, FaceMatchResult } from '@/lib/types';
import GalleryGrid from '@/components/GalleryGrid';
import FaceSearchModal from '@/components/FaceSearchModal';
import QRCodeModal from '@/components/QRCodeModal';
import PinGate, { hasPinAccess } from '@/components/PinGate';
import { downloadPhotosAsZip } from '@/lib/zipDownload';
import { trackPageView, trackAISearch } from '@/lib/analytics';
import { shareViaWhatsApp, shareViaNativeSheet } from '@/lib/shareUtils';

export default function EventGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const eventIdOrSlug = params.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // PIN Gate State — blocks gallery until correct PIN is entered
  const [pinVerified, setPinVerified] = useState(false);

  // AI Face Matching State
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [matchedResults, setMatchedResults] = useState<FaceMatchResult[] | null>(null);
  const [userSelfieUrl, setUserSelfieUrl] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Batch download state
  const [isZippingAll, setIsZippingAll] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!eventIdOrSlug) return;
      setLoading(true);
      const evt = await getEventById(eventIdOrSlug);
      if (evt) {
        setEvent(evt);
        const photoList = await getPhotosByEventId(evt.id);
        setPhotos(photoList);

        // Check if PIN access was already granted this session
        setPinVerified(hasPinAccess(evt.pinCode));

        // Track page view analytics
        trackPageView(evt.id);
      }
      setLoading(false);
    }
    loadData();
  }, [eventIdOrSlug]);

  const handleFaceResultsFound = (results: FaceMatchResult[], selfieDataUrl: string) => {
    setMatchedResults(results);
    setUserSelfieUrl(selfieDataUrl);
    setShowFaceModal(false);

    // Track AI search analytics
    if (event) trackAISearch(event.id);
  };

  const handleResetAIFilter = () => {
    setMatchedResults(null);
    setUserSelfieUrl(null);
  };

  const currentPhotos = matchedResults
    ? matchedResults.map((r) => r.photo)
    : photos;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px', color: '#06b6d4' }} />
        <p>Loading Event Gallery...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Event Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          This event gallery does not exist or has been removed.
        </p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  // PIN Gate: if event is PIN-protected and not yet verified, show PIN numpad
  if (event.pinCode && !pinVerified) {
    return (
      <PinGate
        correctPin={event.pinCode}
        eventTitle={event.title}
        onSuccess={() => setPinVerified(true)}
      />
    );
  }

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Event Banner Hero */}
      <div style={{
        position: 'relative',
        minHeight: '340px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '60px 0 40px',
        overflow: 'hidden',
      }}>
        {/* Background Event Image with dark blur vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${event.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35) blur(2px)',
          transform: 'scale(1.05)',
          zIndex: 0,
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(7, 9, 14, 0.7) 60%, rgba(7, 9, 14, 0.4) 100%)',
          zIndex: 1,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          {/* Back Navigation & Category */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <ArrowLeft size={16} />
              <span>All Events</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-event">{event.category || 'Event'}</span>
              <span className="badge badge-count">{photos.length} Total Photos</span>
            </div>
          </div>

          {/* Title & Metadata */}
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900,
            marginBottom: '12px',
            lineHeight: '1.2',
          }}>
            {event.title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#a855f7" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#06b6d4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.photographerName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={16} color="#10b981" />
                <span>Captured by {event.photographerName}</span>
              </div>
            )}
          </div>

          {/* Main Action Bar for Guests */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}>
            {/* Find My Photos AI Button */}
            <button
              onClick={() => setShowFaceModal(true)}
              className="btn-ai animate-pulse-glow"
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              <Sparkles size={18} />
              <span>⚡ Find My Photos (AI Matcher)</span>
            </button>

            <button
              onClick={() => setShowQRModal(true)}
              className="btn-secondary"
              style={{ padding: '14px 20px', fontSize: '0.9rem' }}
            >
              <QrCode size={18} />
              <span>Event QR Code</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={() => shareViaWhatsApp(event)}
              className="btn-secondary"
              style={{ padding: '14px 20px', fontSize: '0.9rem', background: 'rgba(37, 211, 102, 0.15)', borderColor: 'rgba(37, 211, 102, 0.4)', color: '#25d366' }}
            >
              <MessageCircle size={18} />
              <span>Share via WhatsApp</span>
            </button>

            {/* Native Share / Copy Link */}
            <button
              onClick={() => shareViaNativeSheet(event)}
              className="btn-secondary"
              style={{ padding: '14px 20px', fontSize: '0.9rem' }}
            >
              <Share2 size={18} />
              <span>Share Link</span>
            </button>

            <Link
              href={`/admin/upload/${event.id}`}
              className="btn-secondary"
              style={{ padding: '14px 20px', fontSize: '0.9rem' }}
            >
              <Camera size={18} />
              <span>Upload Photos (+200)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Gallery Area */}
      <div className="container" style={{ marginTop: '36px' }}>
        
        {/* AI Filter Active Notice Banner */}
        {matchedResults && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '16px',
            padding: '18px 24px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: 'var(--shadow-cyan-glow)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {userSelfieUrl && (
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #06b6d4',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)',
                  flexShrink: 0,
                }}>
                  <img src={userSelfieUrl} alt="Your selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                    AI Face Search Results
                  </h3>
                  <span className="badge badge-ai">
                    <UserCheck size={12} /> {matchedResults.length} Photos Found
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Filtered to show only pictures where you are recognized.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setShowFaceModal(true)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Scan Another Selfie
              </button>

              <button
                onClick={handleResetAIFilter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <X size={14} />
                <span>Show All Photos</span>
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <GalleryGrid
          photos={currentPhotos}
          matchedResults={matchedResults || undefined}
          eventTitle={event.title}
        />
      </div>

      {/* AI Face Search Modal */}
      {showFaceModal && (
        <FaceSearchModal
          photos={photos}
          onClose={() => setShowFaceModal(false)}
          onResultsFound={handleFaceResultsFound}
        />
      )}

      {/* QR Code Sharing Modal */}
      {showQRModal && (
        <QRCodeModal
          event={event}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}
