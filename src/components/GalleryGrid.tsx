'use client';

import React, { useState } from 'react';
import { Download, Sparkles, Check, CheckSquare, Square, FolderDown, SearchX, ImageOff } from 'lucide-react';
import { PhotoItem, FaceMatchResult } from '@/lib/types';
import { downloadSinglePhoto, downloadPhotosAsZip } from '@/lib/zipDownload';
import Lightbox from './Lightbox';

interface GalleryGridProps {
  photos: PhotoItem[];
  matchedResults?: FaceMatchResult[];
  eventTitle?: string;
}

export default function GalleryGrid({ photos, matchedResults, eventTitle = 'Event' }: GalleryGridProps) {
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ percent: number; text: string } | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(photos.flatMap((p) => p.tags || []))
  );

  // Filter photos
  const displayedPhotos = photos.filter((p) => {
    if (activeTag === 'All') return true;
    return p.tags?.includes(activeTag);
  });

  // Toggle selection
  const togglePhotoSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedPhotoIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPhotoIds(next);
  };

  const handleSelectAll = () => {
    if (selectedPhotoIds.size === displayedPhotos.length) {
      setSelectedPhotoIds(new Set());
    } else {
      setSelectedPhotoIds(new Set(displayedPhotos.map((p) => p.id)));
    }
  };

  // Batch download selected
  const handleDownloadSelectedZip = async () => {
    const selectedList = photos.filter((p) => selectedPhotoIds.has(p.id));
    if (selectedList.length === 0) return;

    setIsZipping(true);
    setZipProgress({ percent: 10, text: 'Starting download package...' });

    await downloadPhotosAsZip(
      selectedList,
      `${eventTitle.toLowerCase().replace(/\s+/g, '-')}-selected.zip`,
      (percent, text) => setZipProgress({ percent, text })
    );

    setTimeout(() => {
      setIsZipping(false);
      setZipProgress(null);
    }, 1000);
  };

  // Download all current photos (e.g. all matched photos)
  const handleDownloadAllZip = async () => {
    if (displayedPhotos.length === 0) return;

    setIsZipping(true);
    setZipProgress({ percent: 10, text: 'Packaging all photos...' });

    await downloadPhotosAsZip(
      displayedPhotos,
      `${eventTitle.toLowerCase().replace(/\s+/g, '-')}-photos.zip`,
      (percent, text) => setZipProgress({ percent, text })
    );

    setTimeout(() => {
      setIsZipping(false);
      setZipProgress(null);
    }, 1000);
  };

  const getMatchScoreForPhoto = (photoId: string): number | undefined => {
    return matchedResults?.find((r) => r.photo.id === photoId)?.similarity;
  };

  return (
    <div>
      {/* Top Filter and Actions Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px 20px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Category / Tags Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTag('All')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTag === 'All' ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              transition: 'all 0.2s',
            }}
          >
            All Photos ({photos.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: activeTag === tag ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.06)',
                color: '#fff',
                transition: 'all 0.2s',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Action Buttons: Batch Select / Zip Download */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isSelectionMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: isSelectionMode ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              color: '#fff',
            }}
          >
            {isSelectionMode ? <CheckSquare size={14} color="#a855f7" /> : <Square size={14} />}
            <span>{isSelectionMode ? 'Exit Select Mode' : 'Select Multiple'}</span>
          </button>

          {isSelectionMode && selectedPhotoIds.size > 0 && (
            <button
              onClick={handleDownloadSelectedZip}
              disabled={isZipping}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <FolderDown size={14} />
              <span>Download Selected ({selectedPhotoIds.size})</span>
            </button>
          )}

          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping || displayedPhotos.length === 0}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            <Download size={14} />
            <span>Download All as ZIP</span>
          </button>
        </div>
      </div>

      {/* ZIP Progress Banner */}
      {isZipping && zipProgress && (
        <div style={{
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{zipProgress.text}</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{zipProgress.percent}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${zipProgress.percent}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', transition: 'width 0.2s' }} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {displayedPhotos.length === 0 && (
        <div className="glass-panel" style={{
          padding: '60px 24px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px dashed var(--border-subtle)',
          margin: '20px 0',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#38bdf8',
          }}>
            {matchedResults !== undefined ? <SearchX size={32} /> : <ImageOff size={32} />}
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>
            {matchedResults !== undefined ? 'No Matching Photos Found' : 'No Photos in this Category'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
            {matchedResults !== undefined
              ? 'We scanned the event photos, but could not detect a confident biometric match with this selfie. Try capturing a brighter, front-facing selfie.'
              : 'Try selecting "All Photos" to see the full event album.'}
          </p>
        </div>
      )}

      {/* Responsive Masonry Grid */}
      {displayedPhotos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {displayedPhotos.map((photo, idx) => {
            const isSelected = selectedPhotoIds.has(photo.id);
            const matchScore = getMatchScoreForPhoto(photo.id);

            return (
              <div
                key={photo.id}
                className="glass-panel glass-panel-hover"
                onClick={() => {
                  if (isSelectionMode) {
                    togglePhotoSelection(photo.id, { stopPropagation: () => {} } as any);
                  } else {
                    setActiveLightboxIndex(idx);
                  }
                }}
                style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '4 / 3',
                  border: isSelected ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 25px rgba(139, 92, 246, 0.4)' : undefined,
                }}
              >
                {/* Photo Image */}
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={photo.title || `Event photo ${idx + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Gradient overlay for hover text */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 100%)',
                  opacity: isSelected ? 1 : 0.85,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '12px',
                }}>
                  {/* Top Corner: AI Match Score or Selection Checkbox */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {matchScore !== undefined ? (
                      <span className="badge badge-ai" style={{ background: 'rgba(16, 185, 129, 0.25)', borderColor: 'rgba(16, 185, 129, 0.5)', color: '#34d399' }}>
                        <Sparkles size={11} /> {Math.round(matchScore * 100)}% Match
                      </span>
                    ) : <div />}

                    {isSelectionMode ? (
                      <button
                        onClick={(e) => togglePhotoSelection(photo.id, e)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: isSelected ? '#8b5cf6' : 'rgba(0,0,0,0.6)',
                          border: '1px solid rgba(255,255,255,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                      >
                        {isSelected && <Check size={16} strokeWidth={3} />}
                      </button>
                    ) : null}
                  </div>

                  {/* Bottom Corner: Quick Download & Details */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      {photo.title || `Photo #${idx + 1}`}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSinglePhoto(photo, `event-photo-${idx + 1}.jpg`);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        transition: 'all 0.2s',
                      }}
                      title="Download High-Res"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox component */}
      {activeLightboxIndex !== null && displayedPhotos.length > 0 && (
        <Lightbox
          photos={displayedPhotos}
          currentIndex={activeLightboxIndex}
          onClose={() => setActiveLightboxIndex(null)}
          onNavigate={(newIdx) => setActiveLightboxIndex(newIdx)}
          matchScore={getMatchScoreForPhoto(displayedPhotos[activeLightboxIndex]?.id)}
        />
      )}
    </div>
  );
}
