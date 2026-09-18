'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, Eye, QrCode, Image as ImageIcon, RefreshCw, Calendar, MapPin } from 'lucide-react';
import { getEventById, getPhotosByEventId } from '@/lib/db';
import { EventItem, PhotoItem } from '@/lib/types';
import { formatFestiveDate } from '@/utils/dateUtils';
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
      <div className="min-h-screen bg-[#021812] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-amber-200 text-sm font-semibold">Loading Event Upload Manager...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#021812] flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-3xl p-8 max-w-md w-full shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-display font-bold text-amber-100 mb-3">Event Not Found</h2>
          <p className="text-emerald-300/80 text-sm mb-6">The requested event ID could not be located in the database.</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-bold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021812] text-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb & Top Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 text-amber-200 text-xs font-semibold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to Admin Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-amber-200 text-xs font-semibold transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Get Event QR Code</span>
            </button>

            <Link
              href={`/event/${event.slug || event.id}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-bold text-xs shadow-[0_4px_16px_rgba(245,158,11,0.3)] transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>View Public Gallery</span>
            </Link>
          </div>
        </div>

        {/* Event Header Banner */}
        <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-md flex items-center justify-between flex-wrap gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300 uppercase tracking-wider">
                {event.category || 'Festival Event'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Indexing Enabled
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-amber-100 mb-2">
              {event.title}
            </h1>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-emerald-200/80 flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> {event.location || 'Bani Park, Jaipur'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" /> {formatFestiveDate(event.date)}
              </span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{photos.length} Photos in Gallery</span>
            </div>
          </div>

          <div className="bg-emerald-900/70 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 text-center min-w-[140px] shadow-inner">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-display">
              {photos.length}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-300/80 mt-1">
              Photos Indexed
            </div>
          </div>
        </div>

        {/* Upload Success Alert */}
        {uploadSuccessCount !== null && (
          <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-2xl p-4 sm:p-5 mb-8 flex items-center justify-between flex-wrap gap-4 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <span className="font-semibold text-sm sm:text-base text-amber-100">
                Successfully uploaded and indexed {uploadSuccessCount} photo{uploadSuccessCount === 1 ? '' : 's'}!
              </span>
            </div>

            <Link
              href={`/event/${event.slug || event.id}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 font-bold text-xs hover:from-amber-400 transition-all shadow-md"
            >
              <span>Test AI Search in Live Gallery →</span>
            </Link>
          </div>
        )}

        {/* Bulk Uploader Module */}
        <div className="bg-emerald-950/70 border border-emerald-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-12">
          <BulkUploader eventId={event.id} onUploadComplete={handleUploadComplete} />
        </div>

        {/* Currently Uploaded Photos Grid */}
        {photos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-amber-200">
                Existing Event Photos ({photos.length})
              </h3>
              <span className="text-xs text-emerald-300/70">Synced with Community Gallery</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  className="relative rounded-2xl overflow-hidden aspect-square bg-emerald-950 border border-emerald-700/60 group shadow-md hover:border-amber-400/50 transition-all"
                >
                  <img
                    src={p.thumbnailUrl || p.url}
                    alt={p.title || `Photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.faces && p.faces.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] text-amber-300 border border-amber-400/30 flex items-center gap-1 font-semibold">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" /> {p.faces.length} {p.faces.length === 1 ? 'face' : 'faces'}
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
