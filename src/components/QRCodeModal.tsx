'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Check, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import { EventItem } from '@/lib/types';

interface QRCodeModalProps {
  event: EventItem;
  onClose: () => void;
}

export default function QRCodeModal({ event, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  const eventUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/event/${event.slug || event.id}`
    : `https://eventlens.live/event/${event.slug || event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 600;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(img, 50, 50, 500, 500);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${event.slug || 'event'}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: '50%',
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
        }}>
          <QrCode size={26} color="#fff" />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>
          {event.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Print or display this QR code at the event venue. Guests scan to view photos and use the AI selfie search!
        </p>

        {/* QR Code Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          display: 'inline-block',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        }}>
          <QRCodeSVG
            ref={qrRef}
            value={eventUrl}
            size={220}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd"/></svg>',
              x: undefined,
              y: undefined,
              height: 38,
              width: 38,
              excavate: true,
            }}
          />
        </div>

        {/* Event Link Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '8px 12px',
          marginBottom: '20px',
        }}>
          <input
            type="text"
            readOnly
            value={eventUrl}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: copied ? '#34d399' : '#fff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownloadQR}
            className="btn-primary"
            style={{ flex: 1, padding: '12px' }}
          >
            <Download size={16} />
            <span>Download PNG Card</span>
          </button>

          <a
            href={eventUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
