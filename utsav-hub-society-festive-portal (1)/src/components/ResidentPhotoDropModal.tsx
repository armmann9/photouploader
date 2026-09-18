import React, { useState, useEffect } from 'react';
import { Camera, Upload, Check, Heart, X, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { FestivalEvent, CrowdsourcedPhoto } from '../types';
import { INITIAL_CROWDSOURCED_PHOTOS } from '../data/bpscvsData';
import { playTempleBell, playSitarPluck } from '../utils/audio';
import { triggerPhoolBarsao } from '../utils/confetti';

interface ResidentPhotoDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: FestivalEvent[];
}

export const ResidentPhotoDropModal: React.FC<ResidentPhotoDropModalProps> = ({
  isOpen,
  onClose,
  events,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'community_feed'>('upload');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'diwali-2024');

  // Form State
  const [residentName, setResidentName] = useState('');
  const [bungalowPlot, setBungalowPlot] = useState('');
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('#Family');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Photos State
  const [photos, setPhotos] = useState<CrowdsourcedPhoto[]>(() => {
    const saved = localStorage.getItem('bpscvs_crowdsourced_photos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CROWDSOURCED_PHOTOS;
      }
    }
    return INITIAL_CROWDSOURCED_PHOTOS;
  });

  useEffect(() => {
    localStorage.setItem('bpscvs_crowdsourced_photos', JSON.stringify(photos));
  }, [photos]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
      playSitarPluck('Ga');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !residentName.trim() || !bungalowPlot.trim()) return;

    const newPhoto: CrowdsourcedPhoto = {
      id: `crowd-${Date.now()}`,
      eventId: selectedEventId,
      residentName: residentName.trim(),
      bungalowPlot: bungalowPlot.trim(),
      url: previewUrl,
      caption: caption.trim() || 'Festive colony memories',
      tag,
      status: 'approved', // Auto approved for instant delight
      submittedAt: 'Just now',
      likes: 1,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setIsSubmitted(true);
    playTempleBell(980);
    triggerPhoolBarsao();
  };

  const handleLike = (photoId: string) => {
    playSitarPluck('Pa');
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setPreviewUrl(null);
    setCaption('');
    setResidentName('');
    setBungalowPlot('');
    setActiveTab('community_feed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-emerald-950 border border-amber-400/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-amber-50 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>जनता फोटो सबमिशन • Resident Community Photo Drop</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display text-white mt-0.5">
              Share Your Festival Clicks
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 py-3 border-b border-emerald-800/80">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload My Clicks</span>
          </button>

          <button
            onClick={() => setActiveTab('community_feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'community_feed'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Community Feed ({photos.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' ? (
          <div className="py-4">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white font-display">
                  फोटो सफलतापूर्वक सबमिट हो गई!
                </h4>
                <p className="text-xs text-emerald-200 mt-1 mb-5">
                  Thank you for contributing to our colony album. Your picture is now added to the community gallery.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md"
                  >
                    View in Community Feed
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setPreviewUrl(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-900 text-amber-200 text-xs border border-emerald-700"
                  >
                    + Upload Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Motwani"
                      value={residentName}
                      onChange={(e) => setResidentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Bungalow / Plot No. *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 18-B"
                      value={bungalowPlot}
                      onChange={(e) => setBungalowPlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Select Festival Event *
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Tag / Category
                    </label>
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="#Family">#Family (पारिवारिक)</option>
                      <option value="#Candid">#Candid Moments</option>
                      <option value="#Kids">#Kids & Cultural Play</option>
                      <option value="#Decoration">#Rangoli & Decoration</option>
                      <option value="#Prasad">#Mahaprasad & Food</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-200 mb-1">
                    Caption / Moment Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lighting 101 diyas outside our home"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Photo Dropzone & Preview */}
                <div>
                  <label className="block text-xs font-medium text-emerald-200 mb-1">
                    Choose Photo from Device *
                  </label>
                  {previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/80 max-h-56 flex items-center justify-center bg-black/40">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-56 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-emerald-700 hover:border-amber-400/70 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-emerald-900/40 hover:bg-emerald-900/60 transition-all">
                      <Camera className="w-8 h-8 text-amber-400 mb-2" />
                      <span className="text-xs font-bold text-amber-200">
                        Tap here to select photo from gallery or camera
                      </span>
                      <span className="text-[11px] text-emerald-400 mt-0.5">
                        High-resolution JPG or PNG supported (auto-compressed)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!previewUrl || !residentName.trim()}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-emerald-950 font-bold text-xs shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit Photo to Colony Album</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Community Photos Feed */
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-emerald-900/40 border border-emerald-800/80 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                    <img
                      src={p.url}
                      alt={p.caption}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-amber-300 text-[10px] font-semibold border border-amber-400/40">
                      {p.tag}
                    </span>
                    <button
                      onClick={() => handleLike(p.id)}
                      className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/70 hover:bg-rose-900/80 text-rose-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                      <span>{p.likes}</span>
                    </button>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between text-xs">
                    <p className="font-semibold text-white line-clamp-2 leading-tight">
                      {p.caption}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-emerald-300/80 mt-2 pt-2 border-t border-emerald-800">
                      <span>{p.residentName} ({p.bungalowPlot})</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{p.submittedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
