'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, RefreshCw, X, FolderPlus } from 'lucide-react';
import { PhotoItem } from '@/lib/types';
import { savePhotos, updatePhotoFaces } from '@/lib/db';
import { uploadPhotoToCloud, isCloudConfigured } from '@/lib/supabase';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const isCloud = isCloudConfigured();
    const batchSize = 3; // Process 3 images in parallel for smooth performance
    const newPhotosToSave: PhotoItem[] = [];
    let completedCount = 0;

    for (let i = 0; i < queue.length; i += batchSize) {
      const currentBatch = queue.slice(i, i + batchSize);

      await Promise.all(
        currentBatch.map(async (item) => {
          // Update status to uploading
          updateQueueItemStatus(item.id, 'uploading', 25);

          let photoUrl = item.previewUrl;
          let thumbnailUrl = item.previewUrl;

          // 1. Cloud Storage Upload (if configured)
          if (isCloud) {
            const uploadRes = await uploadPhotoToCloud(item.file, item.file.name, eventId);
            if (uploadRes.publicUrl) {
              photoUrl = uploadRes.publicUrl;
              thumbnailUrl = uploadRes.publicUrl;
            }
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

    // Save all to database
    await savePhotos(newPhotosToSave);
    setIsUploading(false);
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
    <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Bulk Photo Uploader (200+ Photos)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Upload high-resolution event photos. AI will automatically index facial features for guest search.
          </p>
        </div>

        {/* Tag selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category Tag:</span>
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="e.g. Sangeet, Ceremony, Keynote"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.8rem',
            }}
          />
        </div>
      </div>

      {/* Drop Zone Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileSelection(e.dataTransfer.files);
        }}
        style={{
          border: '2px dashed rgba(99, 102, 241, 0.4)',
          borderRadius: '16px',
          padding: '40px 20px',
          textAlign: 'center',
          background: 'rgba(99, 102, 241, 0.04)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '24px',
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)')}
      >
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#38bdf8',
        }}>
          <UploadCloud size={30} />
        </div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
          Drag & Drop all event photos here, or click to select
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Supports 200+ images simultaneously • JPG, PNG, WEBP, HEIC
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelection(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Selected Photos Queue Overview */}
      {queue.length > 0 && (
        <div>
          {/* Status summary banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ImageIcon size={18} color="#06b6d4" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {queue.length} Photos Selected ({calculateTotalSizeMB()} MB)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isUploading && (
                <button
                  onClick={handleClearQueue}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  Clear Queue
                </button>
              )}

              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Uploading & Indexing ({overallProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Start Bulk Upload & AI Indexing</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          {isUploading && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Uploading to Cloud & AI Facial Vector Embedding</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{overallProgress}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${overallProgress}%`, background: 'var(--accent-gradient)', transition: 'width 0.2s ease' }} />
              </div>
            </div>
          )}

          {/* Thumbnails preview strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '10px',
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '4px',
          }}>
            {queue.map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  background: 'rgba(0,0,0,0.5)',
                  border: item.status === 'completed' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Status Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {item.status === 'completed' && (
                    <div style={{ textAlign: 'center' }}>
                      <CheckCircle2 size={20} color="#34d399" />
                      {item.facesCount !== undefined && (
                        <div style={{ fontSize: '0.65rem', color: '#fff', marginTop: '2px' }}>
                          {item.facesCount} faces
                        </div>
                      )}
                    </div>
                  )}

                  {item.status === 'uploading' && (
                    <RefreshCw size={18} color="#38bdf8" className="animate-spin" />
                  )}

                  {item.status === 'indexing_faces' && (
                    <div style={{ textAlign: 'center' }}>
                      <Sparkles size={18} color="#a855f7" className="animate-pulse" />
                      <div style={{ fontSize: '0.65rem', color: '#c084fc' }}>AI Indexing</div>
                    </div>
                  )}

                  {item.status === 'pending' && !isUploading && (
                    <button
                      onClick={() => removeQueueItem(item.id)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '2px',
                      }}
                    >
                      <X size={14} />
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
