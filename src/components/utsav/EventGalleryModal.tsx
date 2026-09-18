'use client';

import React, { useState } from 'react';
import { X, Download, Share2, Calendar, MapPin, Users, Camera, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { FestivalEvent, EventPhoto } from '@/types/utsav';
import { playTempleBell, playSitarPluck } from '@/utils/audio';

interface EventGalleryModalProps {
  event: FestivalEvent | null;
  activePhoto: EventPhoto | null;
  onClose: () => void;
  onSelectPhoto: (photo: EventPhoto) => void;
}

export const EventGalleryModal: React.FC<EventGalleryModalProps> = ({
  event,
  activePhoto,
  onClose,
  onSelectPhoto,
}) => {
  if (!event && !activePhoto) return null;

  const currentEvent = event || (activePhoto ? {
    id: activePhoto.eventId,
    title: activePhoto.eventTitle,
    hindiTitle: '',
    date: 'Festival Celebration',
    year: 2024,
    location: 'Society Grounds',
    attendeesCount: 450,
    photoCount: 1,
    coverImage: activePhoto.url,
    colorAccent: '#f59e0b',
    description: activePhoto.caption,
    highlights: [],
    photos: [activePhoto]
  } as FestivalEvent : null);

  if (!currentEvent) return null;

  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = Array.from(
    new Set(currentEvent.photos.flatMap(p => p.tags))
  );

  const filteredPhotos = selectedTag === 'all'
    ? currentEvent.photos
    : currentEvent.photos.filter(p => p.tags.includes(selectedTag));

  const activeIndex = activePhoto 
    ? filteredPhotos.findIndex(p => p.id === activePhoto.id)
    : -1;

  const handleNext = () => {
    if (filteredPhotos.length === 0) return;
    const nextIdx = (activeIndex + 1) % filteredPhotos.length;
    onSelectPhoto(filteredPhotos[nextIdx]);
    playSitarPluck('Ga');
  };

  const handlePrev = () => {
    if (filteredPhotos.length === 0) return;
    const prevIdx = (activeIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    onSelectPhoto(filteredPhotos[prevIdx]);
    playSitarPluck('Re');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="event-gallery-modal"
    >
      <div className="relative w-full max-w-6xl rounded-3xl bg-emerald-950 border border-amber-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 md:p-6 bg-emerald-900/60 border-b border-emerald-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-3xl font-display text-amber-200">
                {currentEvent.title}
              </h2>
              {currentEvent.hindiTitle && (
                <span className="text-xs text-amber-400 font-folk px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30">
                  {currentEvent.hindiTitle}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-300/80 mt-1">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {currentEvent.date}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {currentEvent.location}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-400" /> {currentEvent.attendeesCount}+ Residents</span>
            </div>
          </div>

          <button
            id="close-gallery-modal-btn"
            onClick={() => {
              playSitarPluck('Sa');
              onClose();
            }}
            className="p-2.5 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 border border-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {/* Active Photo Lightbox Spotlight */}
          {activePhoto && (
            <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center">
              <div className="relative flex-1 w-full flex items-center justify-center min-h-[320px] max-h-[520px] bg-black">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  className="max-h-[500px] w-auto max-w-full object-contain"
                />

                {/* Left/Right Nav Arrows */}
                {filteredPhotos.length > 1 && (
                  <>
                    <button
                      id="lightbox-prev-btn"
                      onClick={handlePrev}
                      className="absolute left-3 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-amber-300 border border-amber-500/30 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      id="lightbox-next-btn"
                      onClick={handleNext}
                      className="absolute right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-amber-300 border border-amber-500/30 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Photo Details Sidebar */}
              <div className="w-full md:w-80 p-5 bg-emerald-950/90 border-t md:border-t-0 md:border-l border-emerald-800 flex flex-col justify-between self-stretch">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Captured Moment
                  </span>
                  <p className="text-sm font-semibold text-amber-100 mb-3">
                    {activePhoto.caption}
                  </p>

                  <div className="space-y-2 text-xs text-emerald-200/80 mb-4">
                    {activePhoto.photographer && (
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>Shot by: {activePhoto.photographer}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Time: {activePhoto.takenAt}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {activePhoto.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-amber-300 border border-emerald-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-emerald-800">
                  <a
                    id="download-lightbox-photo"
                    href={activePhoto.url}
                    download="society-event-memory.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download HD</span>
                  </a>

                  <button
                    id="share-lightbox-photo"
                    onClick={() => {
                      const text = encodeURIComponent(`🎉 Look at this beautiful memory from our Society Festival "${currentEvent.title}": ${activePhoto.caption}`);
                      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tag Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-amber-400 font-semibold mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Filter Album:
            </span>
            <button
              id="tag-all-btn"
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTag === 'all'
                  ? 'bg-amber-500 text-emerald-950 font-bold'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              All Photos ({currentEvent.photos.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                id={`tag-filter-${tag}`}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-emerald-950 font-bold'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => {
              const isSelected = activePhoto?.id === photo.id;
              return (
                <div
                  key={photo.id}
                  id={`gallery-thumb-${photo.id}`}
                  onClick={() => {
                    onSelectPhoto(photo);
                    playSitarPluck('Sa');
                  }}
                  className={`group relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[0.98]'
                      : 'border-emerald-800/80 hover:border-amber-400/70 hover:scale-[1.02]'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                    <p className="text-[11px] font-medium text-amber-200 truncate">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
