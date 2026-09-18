'use client';

import React, { useState } from 'react';
import { Download, Sparkles, Check, CheckSquare, Square, FolderDown, SearchX, ImageOff, Eye } from 'lucide-react';
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
    setZipProgress({ percent: 10, text: 'Packaging selected photos into ZIP...' });

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

  // Download all current photos
  const handleDownloadAllZip = async () => {
    if (displayedPhotos.length === 0) return;

    setIsZipping(true);
    setZipProgress({ percent: 10, text: 'Packaging all event photos into ZIP...' });

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
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 shadow-lg backdrop-blur-md">
        {/* Category / Tags Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTag('All')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTag === 'All'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/80 border border-emerald-700/40'
            }`}
          >
            All Photos ({photos.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTag === tag
                  ? 'bg-amber-500 text-emerald-950 shadow-md'
                  : 'bg-emerald-900/40 text-emerald-300/80 hover:bg-emerald-900/80 border border-emerald-700/40'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Action Buttons: Batch Select / Zip Download */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              isSelectionMode
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/70'
            }`}
          >
            {isSelectionMode ? <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> : <Square className="w-3.5 h-3.5" />}
            <span>{isSelectionMode ? 'Exit Select Mode' : 'Select Multiple'}</span>
          </button>

          {isSelectionMode && selectedPhotoIds.size > 0 && (
            <button
              onClick={handleDownloadSelectedZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>Download Selected ({selectedPhotoIds.size})</span>
            </button>
          )}

          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping || displayedPhotos.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download All as ZIP</span>
          </button>
        </div>
      </div>

      {/* ZIP Progress Banner */}
      {isZipping && zipProgress && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 mb-6 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold text-amber-200">
            <span>{zipProgress.text}</span>
            <span>{zipProgress.percent}%</span>
          </div>
          <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${zipProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {displayedPhotos.length === 0 && (
        <div className="p-16 rounded-3xl bg-emerald-950/40 border border-emerald-800/40 text-center my-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 flex items-center justify-center mx-auto mb-3 text-amber-400">
            {matchedResults !== undefined ? <SearchX className="w-7 h-7" /> : <ImageOff className="w-7 h-7" />}
          </div>
          <h3 className="text-lg font-bold text-amber-200 mb-1">
            {matchedResults !== undefined ? 'No Matching Photos Found' : 'No Photos in this Category'}
          </h3>
          <p className="text-xs text-emerald-400/60 max-w-sm mx-auto">
            {matchedResults !== undefined
              ? 'We scanned the event photos, but could not detect a confident match with this selfie. Try capturing a clearer front-facing selfie.'
              : 'Try selecting "All Photos" to see the full event album.'}
          </p>
        </div>
      )}

      {/* Responsive Gallery Grid */}
      {displayedPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedPhotos.map((photo, idx) => {
            const isSelected = selectedPhotoIds.has(photo.id);
            const matchScore = getMatchScoreForPhoto(photo.id);

            return (
              <div
                key={photo.id}
                onClick={() => {
                  if (isSelectionMode) {
                    togglePhotoSelection(photo.id, { stopPropagation: () => {} } as any);
                  } else {
                    setActiveLightboxIndex(idx);
                  }
                }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] bg-[#02140e] border transition-all duration-300 group ${
                  isSelected
                    ? 'border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.4)] ring-2 ring-amber-400'
                    : 'border-emerald-800/60 hover:border-amber-400/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Photo Image */}
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={photo.title || `Event photo ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-85 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 pointer-events-none">
                  {/* Top Corner: AI Match Score or Selection Checkbox */}
                  <div className="flex justify-between items-center pointer-events-auto">
                    {matchScore !== undefined ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-emerald-950 text-[10px] font-bold shadow-md">
                        <Sparkles className="w-3 h-3" /> {Math.round(matchScore * 100)}% Match
                      </span>
                    ) : (
                      <div />
                    )}

                    {isSelectionMode && (
                      <button
                        type="button"
                        onClick={(e) => togglePhotoSelection(photo.id, e)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                            : 'bg-black/60 border border-white/40 text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    )}
                  </div>

                  {/* Bottom Corner: Quick Download & Details */}
                  <div className="flex justify-between items-center pointer-events-auto">
                    <span className="text-[11px] text-amber-200/90 font-medium truncate max-w-[70%]">
                      {photo.title || `Photo #${idx + 1}`}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadSinglePhoto(photo, `event-photo-${idx + 1}.jpg`);
                        }}
                        className="w-7 h-7 rounded-lg bg-black/60 hover:bg-amber-500 hover:text-emerald-950 border border-white/20 text-white flex items-center justify-center transition-all"
                        title="Download High-Res Photo"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
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
