'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, RefreshCw, X, FolderPlus, Zap, Database } from 'lucide-react';
import { PhotoItem } from '@/lib/types';
import { savePhotos } from '@/lib/db';
import { uploadPhoto, getStorageStatus, StorageStatus } from '@/lib/storage';
import { detectFacesAndExtractEmbeddings, createImageElementFromBlob } from '@/lib/faceRecognition';

interface BulkUploaderProps {
  eventId: string;
  onUploadComplete: (uploadedCount: number) => void;
}

interface UploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number; // 0 to 100
  status: 'pending' | 'uploading' | 'indexing_faces' | 'completed' | 'error';
  errorMessage?: string;
  facesCount?: number;
}

export default function BulkUploader({ eventId, onUploadComplete }: BulkUploaderProps) {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentTag, setCurrentTag] = useState('Highlights');
  const [overallProgress, setOverallProgress] = useState(0);
  const [sessionOnlyWarning, setSessionOnlyWarning] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageStatus>({
    r2Configured: false,
    supabaseConfigured: false,
    activeProvider: 'session',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getStorageStatus().then((status) => {
      setStorageInfo(status);
    });
  }, []);

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: UploadQueueItem[] = Array.from(files).map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
    }));

    setQueue((prev) => [...prev, ...newItems]);
  };

  const calculateTotalSizeMB = () => {
    const totalBytes = queue.reduce((sum, item) => sum + item.file.size, 0);
    return (totalBytes / (1024 * 1024)).toFixed(1);
  };

  const handleStartUpload = async () => {
    if (queue.length === 0 || isUploading) return;
    setIsUploading(true);

    const batchSize = 3; // Process 3 images in parallel for smooth performance
    const newPhotosToSave: PhotoItem[] = [];
    let completedCount = 0;
    let anySessionOnly = false;

    for (let i = 0; i < queue.length; i += batchSize) {
      const currentBatch = queue.slice(i, i + batchSize);

      await Promise.all(
        currentBatch.map(async (item) => {
          // Update status to uploading
          updateQueueItemStatus(item.id, 'uploading', 25);

          let photoUrl: string;
          let thumbnailUrl: string;

          // 1. Storage Upload (Cloudflare R2 preferred -> Supabase -> Session Fallback)
          const uploadRes = await uploadPhoto(item.file, item.file.name, eventId);

          if (uploadRes.publicUrl) {
            photoUrl = uploadRes.publicUrl;
            thumbnailUrl = uploadRes.publicUrl;
          } else {
            // Cloud upload attempt failed / no cloud provider — use blob URL for this session.
            photoUrl = item.previewUrl;
            thumbnailUrl = item.previewUrl;
            anySessionOnly = true;
          }

          updateQueueItemStatus(item.id, 'indexing_faces', 60);

          // 2. AI Face Recognition Embedding Extraction
          let faceDescriptors: PhotoItem['faces'] = [];
          try {
            const imgElement = await createImageElementFromBlob(item.file);
            const detections = await detectFacesAndExtractEmbeddings(imgElement);
            faceDescriptors = detections.map((d) => ({
              box: d.box,
              descriptor: d.descriptor,
              confidence: d.confidence,
            }));
          } catch (aiErr) {
            console.warn('AI Face indexing notice:', aiErr);
          }

          updateQueueItemStatus(item.id, 'completed', 100, faceDescriptors?.length);

          const newPhoto: PhotoItem = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            eventId,
            url: photoUrl,
            thumbnailUrl,
            title: item.file.name.replace(/\.[^/.]+$/, ''),
            sizeBytes: item.file.size,
            uploadedAt: new Date().toISOString(),
            tags: currentTag ? [currentTag] : ['Event'],
            faces: faceDescriptors,
          };

          newPhotosToSave.push(newPhoto);
          completedCount++;
          setOverallProgress(Math.round((completedCount / queue.length) * 100));
        })
      );
    }

    // Save metadata to database
    await savePhotos(newPhotosToSave);
    setIsUploading(false);
    if (anySessionOnly) setSessionOnlyWarning(true);
    onUploadComplete(newPhotosToSave.length);
  };

  const updateQueueItemStatus = (
    id: string,
    status: UploadQueueItem['status'],
    progress: number,
    facesCount?: number
  ) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, progress, facesCount: facesCount ?? item.facesCount }
          : item
      )
    );
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearQueue = () => {
    setQueue([]);
    setOverallProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h3 className="text-xl font-display font-bold text-amber-200">
              Bulk Photo Uploader (200+ Photos)
            </h3>
            {/* Storage Provider Status Badge */}
            {storageInfo.activeProvider === 'r2' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Cloudflare R2 Storage (Active)
              </span>
            ) : storageInfo.activeProvider === 'supabase' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Supabase Storage (Active)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium bg-emerald-900/60 text-emerald-300/80 border border-emerald-700/50">
                Session Mode (Local)
              </span>
            )}
          </div>
          <p className="text-xs text-emerald-300/70">
            Upload high-resolution event photos. AI automatically indexes facial features for resident search.
          </p>
        </div>

        {/* Tag selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-300/80">Category Tag:</span>
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="e.g. Sangeet, Ceremony, Aarti"
            className="px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-amber-100 text-xs focus:border-amber-400 outline-none transition-all placeholder:text-emerald-400/40"
          />
        </div>
      </div>

      {/* Cloud Storage Warning Banner (Quota safety) */}
      {sessionOnlyWarning && (
        <div className="bg-amber-950/80 border border-amber-500/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
            <p className="font-bold text-amber-300">
              Cloud Storage Not Configured — Session-Only Mode Active
            </p>
            <p>
              Photos are stored in memory for this browser session. To protect against the browser's 5MB local storage quota limit, full image data is not saved to localStorage.
            </p>
            <p className="text-amber-400/80">
              To persist photos across refreshes and devices, configure <strong className="text-amber-200">Cloudflare R2</strong> (<code className="bg-emerald-950 px-1 py-0.5 rounded text-amber-200">R2_ACCOUNT_ID</code>, <code className="bg-emerald-950 px-1 py-0.5 rounded text-amber-200">R2_BUCKET_NAME</code>) or Supabase in your environment variables.
            </p>
          </div>
        </div>
      )}

      {/* Drop Zone Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileSelection(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-amber-400/40 hover:border-amber-400 rounded-3xl p-8 sm:p-12 text-center bg-emerald-950/40 hover:bg-emerald-900/30 transition-all cursor-pointer shadow-inner group"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 text-amber-400 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h4 className="text-base sm:text-lg font-bold text-amber-100 mb-1">
          Drag & Drop all event photos here, or click to browse
        </h4>
        <p className="text-xs text-emerald-300/70">
          Supports 200+ images simultaneously • JPG, PNG, WEBP, HEIC
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelection(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Selected Photos Queue Overview */}
      {queue.length > 0 && (
        <div className="space-y-4">
          {/* Status summary banner */}
          <div className="flex items-center justify-between bg-emerald-900/60 border border-emerald-700/50 px-4 py-3 rounded-2xl flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-amber-200">
                {queue.length} Photos Selected ({calculateTotalSizeMB()} MB)
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {!isUploading && (
                <button
                  onClick={handleClearQueue}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-semibold transition-all"
                >
                  Clear Queue
                </button>
              )}

              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-emerald-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading & Indexing ({overallProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Bulk Upload & AI Indexing</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-emerald-300">
                <span>Uploading to {storageInfo.activeProvider === 'r2' ? 'Cloudflare R2' : storageInfo.activeProvider === 'supabase' ? 'Supabase Cloud' : 'Storage'} & Indexing Face Vectors</span>
                <span className="text-amber-400">{overallProgress}%</span>
              </div>
              <div className="h-2.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Thumbnails preview strip */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-80 overflow-y-auto p-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden aspect-square bg-emerald-950 border ${
                  item.status === 'completed'
                    ? 'border-emerald-400'
                    : 'border-emerald-800'
                }`}
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  {item.status === 'completed' && (
                    <div className="text-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                      {item.facesCount !== undefined && (
                        <div className="text-[10px] text-amber-200 mt-0.5 font-semibold">
                          {item.facesCount} {item.facesCount === 1 ? 'face' : 'faces'}
                        </div>
                      )}
                    </div>
                  )}

                  {item.status === 'uploading' && (
                    <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                  )}

                  {item.status === 'indexing_faces' && (
                    <div className="text-center">
                      <Sparkles className="w-5 h-5 text-purple-400 animate-pulse mx-auto" />
                      <div className="text-[9px] text-purple-200 font-semibold">AI Indexing</div>
                    </div>
                  )}

                  {item.status === 'pending' && !isUploading && (
                    <button
                      onClick={() => removeQueueItem(item.id)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
