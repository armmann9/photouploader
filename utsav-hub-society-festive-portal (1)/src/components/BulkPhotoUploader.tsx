import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileImage, Sparkles, Layers, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { BulkUploadFile } from '../types';
import { playTempleBell, playSitarPluck } from '../utils/audio';
import { triggerPhoolBarsao } from '../utils/confetti';

export const BulkPhotoUploader: React.FC = () => {
  const [eventName, setEventName] = useState('Diwali 2024 - Maha Deepotsav');
  const [photographer, setPhotographer] = useState('Rohan Sharma (Tower B-402)');
  const [files, setFiles] = useState<BulkUploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Load a batch simulation of 12 sample high-res camera photos representing a 300-photo event upload
  const load300PhotosBatch = () => {
    playSitarPluck('Ga');
    const mockSampleNames = [
      'IMG_4021_RAW_DSLR.jpg', 'IMG_4022_RAW_DSLR.jpg', 'IMG_4023_RAW_DSLR.jpg',
      'IMG_4024_RAW_DSLR.jpg', 'IMG_4025_RAW_DSLR.jpg', 'IMG_4026_RAW_DSLR.jpg',
      'IMG_4027_RAW_DSLR.jpg', 'IMG_4028_RAW_DSLR.jpg', 'IMG_4029_RAW_DSLR.jpg',
      'IMG_4030_RAW_DSLR.jpg', 'IMG_4031_RAW_DSLR.jpg', 'IMG_4032_RAW_DSLR.jpg',
    ];

    const sampleImages = [
      'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1514480571732-f3f80c6c8e3a?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1551893478-d726eaf0442c?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1630959305606-3123a081dada?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=400&q=80',
    ];

    const generated: BulkUploadFile[] = mockSampleNames.map((name, i) => {
      const originalBytes = Math.floor(6.5 * 1024 * 1024 + Math.random() * 3 * 1024 * 1024); // ~6.5 to 9.5 MB
      const compressedBytes = Math.floor(originalBytes * 0.05); // ~350 KB (95% compression)
      return {
        id: `batch-${i}`,
        name,
        originalSize: originalBytes,
        compressedSize: compressedBytes,
        previewUrl: sampleImages[i % sampleImages.length],
        status: 'queued',
        progress: 0,
        facesDetected: Math.floor(1 + Math.random() * 5),
      };
    });

    setFiles(generated);
    setUploadComplete(false);
  };

  const startBatchPipeline = () => {
    if (files.length === 0) return;
    setIsUploading(true);
    playTempleBell(880);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= files.length) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadComplete(true);
        playTempleBell(1020);
        triggerPhoolBarsao();
        return;
      }

      setFiles(prev =>
        prev.map((f, idx) => {
          if (idx === currentIndex) {
            return { ...f, status: 'uploaded', progress: 100 };
          } else if (idx === currentIndex + 1) {
            return { ...f, status: 'indexing_faces', progress: 65 };
          } else if (idx === currentIndex + 2) {
            return { ...f, status: 'compressing', progress: 30 };
          }
          return f;
        })
      );

      currentIndex++;
    }, 280);
  };

  const totalRawMB = files.reduce((acc, f) => acc + f.originalSize, 0) / (1024 * 1024);
  const totalCompMB = files.reduce((acc, f) => acc + f.compressedSize, 0) / (1024 * 1024);
  const savingsPercent = totalRawMB > 0 ? Math.round(((totalRawMB - totalCompMB) / totalRawMB) * 100) : 95;

  return (
    <div className="w-full rounded-3xl bg-emerald-950/70 border border-emerald-800/80 p-6 md:p-10 shadow-2xl backdrop-blur-md" id="bulk-uploader-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-400/40 text-yellow-300 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5 text-yellow-400" />
            <span>Society Committee Admin Panel</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display text-amber-200">
            300+ Photo Bulk Uploader & Compressor
          </h2>
          <p className="text-emerald-300/80 text-xs md:text-sm mt-1 max-w-2xl">
            Handles 300 to 500 photos per event effortlessly. In-browser client compression shrinks 2.5 GB of DSLR photos to 120 MB before uploading, saving your server from crashing and keeping costs at ₹0!
          </p>
        </div>

        <button
          id="simulate-300-photos-btn"
          onClick={load300PhotosBatch}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 whitespace-nowrap"
        >
          <Layers className="w-4 h-4" />
          <span>Load 300-Photo Simulation Batch</span>
        </button>
      </div>

      {/* Metadata Configuration Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-amber-300 mb-1.5">Event Name</label>
          <input
            id="input-event-name"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-amber-300 mb-1.5">Official Society Photographer</label>
          <input
            id="input-photographer-name"
            type="text"
            value={photographer}
            onChange={(e) => setPhotographer(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-amber-300 mb-1.5">Storage Destination</label>
          <select 
            id="select-storage-dest"
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
          >
            <option>Cloudinary CDN (Recommended - 25GB Free)</option>
            <option>Firebase Cloud Storage (5GB Free)</option>
            <option>AWS S3 + Cloudflare CDN</option>
          </select>
        </div>
      </div>

      {/* Live Bandwidth & Compression Stats Bar */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-emerald-900/50 border border-emerald-700/60 mb-6">
          <div>
            <span className="text-[11px] text-emerald-300/80 block">Photos in Queue</span>
            <span className="text-xl font-bold text-amber-200">{files.length} Photos</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300/80 block">Raw Camera Size</span>
            <span className="text-xl font-bold text-red-300">{totalRawMB.toFixed(1)} MB</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300/80 block">Optimized WebP Size</span>
            <span className="text-xl font-bold text-emerald-300">{totalCompMB.toFixed(1)} MB</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300/80 block">Bandwidth & Space Saved</span>
            <span className="text-xl font-bold text-amber-400">{savingsPercent}% Saved</span>
          </div>
        </div>
      )}

      {/* Photos Queue Display */}
      {files.length > 0 ? (
        <div className="space-y-4">
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={file.previewUrl} alt="" className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-400/40" />
                  <div>
                    <span className="font-semibold text-amber-100 block">{file.name}</span>
                    <span className="text-emerald-300/80">
                      {(file.originalSize / (1024 * 1024)).toFixed(1)} MB → {(file.compressedSize / 1024).toFixed(0)} KB WebP
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-emerald-800">
                    👤 {file.facesDetected} Faces Detected
                  </span>

                  <span className={`px-2.5 py-1 rounded-full font-semibold ${
                    file.status === 'uploaded' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                      : file.status === 'indexing_faces'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-400'
                  }`}>
                    {file.status === 'uploaded' ? '✓ Uploaded & Indexed' : file.status === 'indexing_faces' ? '⚡ Indexing Faces...' : '⏳ Queued'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80">
            <span className="text-xs text-emerald-300">
              {uploadComplete ? '✅ All 300 photos indexed into face recognition database!' : 'Ready to upload with in-browser compression & AI face indexing'}
            </span>

            <button
              id="start-batch-upload-btn"
              onClick={startBatchPipeline}
              disabled={isUploading || uploadComplete}
              className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                uploadComplete
                  ? 'bg-green-600 text-white cursor-default'
                  : isUploading
                    ? 'bg-amber-600/70 text-amber-200 cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 active:scale-95'
              }`}
            >
              {uploadComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Upload & Indexing Complete</span>
                </>
              ) : isUploading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Compressing & Indexing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Start Batch Upload & Face Indexing</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Empty State Dropzone */
        <div 
          onClick={load300PhotosBatch}
          className="cursor-pointer border-2 border-dashed border-emerald-700/80 hover:border-amber-400/80 rounded-2xl p-10 text-center transition-all bg-emerald-900/20 hover:bg-emerald-900/40"
        >
          <UploadCloud className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-bounce" style={{ animationDuration: '2.5s' }} />
          <h3 className="text-lg font-semibold text-amber-200 mb-1">Drag & Drop 300+ Event Photos Here</h3>
          <p className="text-xs text-emerald-300/80 max-w-md mx-auto mb-4">
            Supports JPG, PNG, RAW DSLR images. In-browser engine will automatically resize to WebP, generate thumbnails, and index resident faces.
          </p>
          <button 
            id="sample-demo-photos-trigger"
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 text-xs font-semibold border border-emerald-600 transition-colors"
          >
            Click to Load Sample 300-Photo Batch
          </button>
        </div>
      )}
    </div>
  );
};
