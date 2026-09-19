'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Share2,
  Download,
  RefreshCw,
  Eye,
  AlertCircle,
  Sliders,
  Maximize2,
  X,
  Zap,
} from 'lucide-react';
import type { FestivalEvent, EventPhoto } from '@/types/utsav';
import type { FaceMatchResult, PhotoItem } from '@/lib/types';
import {
  extractSelfieDescriptor,
  detectFacesAndExtractEmbeddings,
  evaluateFaceMatch,
  loadFaceApiModels,
  loadSafeImage,
  MatchSensitivity,
} from '@/lib/faceRecognition';
import { getAllEvents, getPhotosByEventId } from '@/lib/db';
import { playTempleBell, playSitarPluck } from '@/utils/audio';
import { triggerPhoolBarsao } from '@/utils/confetti';

interface HomeFaceFinderProps {
  events: FestivalEvent[];
}

export default function HomeFaceFinder({ events }: HomeFaceFinderProps) {
  const [selectedEventScope, setSelectedEventScope] = useState<string>('all');
  const [sensitivity, setSensitivity] = useState<MatchSensitivity>('balanced');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [matchedResults, setMatchedResults] = useState<FaceMatchResult[]>([]);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [allDbPhotos, setAllDbPhotos] = useState<PhotoItem[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preload face models and load all DB photos on mount
  useEffect(() => {
    loadFaceApiModels();
    loadAllPhotos();

    const handlePhotoUpdate = () => {
      loadAllPhotos();
    };

    window.addEventListener('bpscvs_events_updated', handlePhotoUpdate);
    window.addEventListener('storage', handlePhotoUpdate);

    return () => {
      stopCamera();
      window.removeEventListener('bpscvs_events_updated', handlePhotoUpdate);
      window.removeEventListener('storage', handlePhotoUpdate);
    };
  }, []);

  const loadAllPhotos = async () => {
    try {
      const dbEvents = await getAllEvents();
      const photoPromises = dbEvents.map((ev) => getPhotosByEventId(ev.id));
      const photoArrays = await Promise.all(photoPromises);
      const flattened = photoArrays.flat();
      if (flattened.length > 0) {
        setAllDbPhotos(flattened);
      }
    } catch (err) {
      console.warn('Could not load database photos for face finder:', err);
    }
  };

  // Merge seed event photos and uploaded DB photos
  const searchablePhotos = useMemo<PhotoItem[]>(() => {
    const seedPhotos: PhotoItem[] = events.flatMap((event) =>
      event.photos.map((photo) => ({
        id: photo.id,
        eventId: photo.eventId || event.id,
        url: photo.highResUrl || photo.url,
        thumbnailUrl: photo.url,
        title: photo.caption || event.title,
        uploadedAt: photo.takenAt,
        tags: photo.tags || ['Festival'],
      }))
    );

    // Merge without duplicates
    const idSet = new Set<string>();
    const merged: PhotoItem[] = [];

    // Prioritize DB photos (they contain actual R2 links & indexed faces)
    allDbPhotos.forEach((p) => {
      if (!idSet.has(p.id)) {
        idSet.add(p.id);
        merged.push(p);
      }
    });

    seedPhotos.forEach((p) => {
      if (!idSet.has(p.id)) {
        idSet.add(p.id);
        merged.push(p);
      }
    });

    return merged;
  }, [events, allDbPhotos]);

  // Filter photos by selected scope
  const filteredPhotos = useMemo(() => {
    if (selectedEventScope === 'all') return searchablePhotos;
    return searchablePhotos.filter(
      (p) => p.eventId === selectedEventScope || p.eventId?.toLowerCase().includes(selectedEventScope.toLowerCase())
    );
  }, [searchablePhotos, selectedEventScope]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
        playSitarPluck('Sa');
      } else {
        setCameraError('Camera not supported on this device. Please upload a photo!');
      }
    } catch (err) {
      console.warn('Camera access denied:', err);
      setCameraError('Camera access was denied. Please allow camera permissions or upload a selfie below!');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror snapshot for natural selfie feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setSelectedImage(dataUrl);
    stopCamera();
    playTempleBell(1050);

    runFaceRecognition(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setSelectedImage(url);
      stopCamera();
      playSitarPluck('Pa');
      runFaceRecognition(url);
    };
    reader.readAsDataURL(file);
  };

  const runFaceRecognition = async (selfieUrl: string) => {
    setIsScanning(true);
    setScanProgress(5);
    setHasScanned(false);
    setMatchedResults([]);
    setScanStatus('Analyzing facial structure & extracting 128-d biometric vectors...');

    try {
      // 1. Create safe image element from selfie URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = selfieUrl;
      });

      // 2. Extract reference descriptor
      const selfieFace = await extractSelfieDescriptor(img);

      if (!selfieFace) {
        setIsScanning(false);
        setScanStatus('No face detected in reference photo. Please upload a clear, front-facing selfie.');
        return;
      }

      setScanProgress(20);
      setScanStatus(`Scanning ${filteredPhotos.length} festival photos with calibrated matching...`);

      const matches: FaceMatchResult[] = [];
      const total = filteredPhotos.length;

      // 3. Scan through all candidate photos
      for (let i = 0; i < total; i++) {
        const photo = filteredPhotos[i];
        setScanProgress(20 + Math.round(((i + 1) / total) * 75));

        // Path A: Pre-indexed face embeddings (Fastest & Most Accurate)
        if (photo.faces && photo.faces.length > 0) {
          let highestScore = 0;
          let bestFaceBox = undefined;
          let isMatch = false;

          for (const face of photo.faces) {
            const evalResult = evaluateFaceMatch(selfieFace.descriptor, face.descriptor, sensitivity);
            if (evalResult.isMatch && evalResult.similarityScore > highestScore) {
              highestScore = evalResult.similarityScore;
              bestFaceBox = face.box;
              isMatch = true;
            }
          }

          if (isMatch) {
            matches.push({
              photo,
              similarity: highestScore,
              matchedFaceBox: bestFaceBox,
            });
          }
        } else {
          // Path B: Real-time on-the-fly face embedding extraction
          try {
            const targetImg = await loadSafeImage(photo.url || photo.thumbnailUrl);
            if (targetImg) {
              const detectedFaces = await detectFacesAndExtractEmbeddings(targetImg);
              let highestScore = 0;
              let bestFaceBox = undefined;
              let isMatch = false;

              for (const face of detectedFaces) {
                const evalResult = evaluateFaceMatch(selfieFace.descriptor, face.descriptor, sensitivity);
                if (evalResult.isMatch && evalResult.similarityScore > highestScore) {
                  highestScore = evalResult.similarityScore;
                  bestFaceBox = face.box;
                  isMatch = true;
                }
              }

              if (isMatch) {
                matches.push({
                  photo,
                  similarity: highestScore,
                  matchedFaceBox: bestFaceBox,
                });
              }
            }
          } catch {
            // Ignore single photo network issue
          }
        }
      }

      // Sort descending by highest similarity match
      matches.sort((a, b) => b.similarity - a.similarity);

      setScanProgress(100);
      setMatchedResults(matches);
      setIsScanning(false);
      setHasScanned(true);

      if (matches.length > 0) {
        setScanStatus(`Found ${matches.length} matching celebration photo${matches.length === 1 ? '' : 's'}!`);
        playTempleBell(880);
        triggerPhoolBarsao();
      } else {
        setScanStatus('No exact match found with current sensitivity. Try switching to "Broad Search" or selecting "All Events"!');
      }
    } catch (err) {
      console.error('Face recognition error:', err);
      setIsScanning(false);
      setScanStatus('Face search encountered an error. Please try another selfie.');
    }
  };

  const shareToWhatsApp = (photo: PhotoItem, score: number) => {
    const text = encodeURIComponent(
      `🎉 Found my festival photo (${Math.round(score * 100)}% match) on our Colony Utsav Hub!\n\nView Photo: ${photo.url}\n\n— Bani Park Sindhi Colony Vikas Samiti`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const downloadPhoto = (url: string, filename?: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename || 'festival-photo'}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="relative w-full rounded-3xl bg-emerald-950/70 border border-emerald-800/80 p-6 md:p-10 shadow-2xl backdrop-blur-md overflow-hidden mb-20 scroll-mt-24"
      id="face-match-portal"
    >
      {/* Background traditional mandala watermark */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
          <circle cx="100" cy="100" r="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4" fill="none" />
          <polygon points="100,20 170,140 30,140" stroke="#fbbf24" strokeWidth="2" fill="none" />
          <polygon points="100,180 170,60 30,60" stroke="#fbbf24" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>ढूंढो मेरी तस्वीर • AI Face Recognition Portal</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-wide mb-3">
          Find Your Photos in 2 Seconds
        </h2>
        <p className="text-emerald-200/90 text-sm md:text-base leading-relaxed">
          No more scrolling through hundreds of event photos! Simply upload a quick selfie or use your camera. Our AI compares 128-point biometric vectors locally on your device with 100% privacy.
        </p>
      </div>

      {/* Controls & Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left Column: Reference Face Camera / Upload HUD */}
        <div className="lg:col-span-5 flex flex-col items-center bg-emerald-900/50 p-6 rounded-2xl border border-emerald-700/50 shadow-inner">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Step 1: Your Reference Face</span>
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> 100% Private (Device-Safe)
            </span>
          </div>

          {/* Camera / Image Display Viewport with Face Target Reticle */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden bg-black/70 border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center justify-center">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected reference face"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-emerald-300/70 space-y-2">
                <Camera className="w-12 h-12 mx-auto text-amber-400/60 stroke-1" />
                <p className="text-xs font-semibold">Take a selfie or upload a photo of your face</p>
              </div>
            )}

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-amber-400/30 rounded-2xl m-3 flex items-center justify-center">
              <div className="w-36 h-44 rounded-full border border-amber-400/50 opacity-60" />
            </div>

            {/* Top-left & Bottom-right Tech Crosshairs */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

            {/* Scanning Overlay Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-0 animate-bounce" />
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                <span className="text-xs font-bold text-amber-300">Biometric Vector Matching</span>
                <span className="text-[11px] text-emerald-200 mt-1">{scanProgress}% complete</span>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="mt-3 flex items-start gap-2 text-xs text-amber-300 bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/40 w-full">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            {isCameraActive ? (
              <button
                type="button"
                onClick={capturePhoto}
                className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-emerald-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot & Match</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={startCamera}
                  className="py-2.5 px-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 font-bold text-xs border border-emerald-600 transition-all flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Use Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-emerald-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Right Column: Search Scope, Sensitivity & Match Activation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 2: SEARCH SCOPE SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step 2: Select Search Scope
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                {searchablePhotos.length} Festival Photos in Database
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedEventScope('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedEventScope === 'all'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 shadow-md scale-105'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/60'
                }`}
              >
                All Events & Festivals
              </button>

              {events.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setSelectedEventScope(ev.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedEventScope === ev.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 shadow-md scale-105'
                      : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/60'
                  }`}
                >
                  {ev.title}
                </button>
              ))}
            </div>
          </div>

          {/* SENSITIVITY CALIBRATION SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" /> Matching Sensitivity
              </span>
              <span className="text-xs text-amber-300/80 font-medium">
                {sensitivity === 'strict'
                  ? '🎯 Strict (90%+ Confidence)'
                  : sensitivity === 'balanced'
                  ? '⚖️ Balanced (Recommended)'
                  : '🌐 Broad Search (Finds All)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['strict', 'balanced', 'relaxed'] as MatchSensitivity[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setSensitivity(mode);
                    if (selectedImage) runFaceRecognition(selectedImage);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    sensitivity === mode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                      : 'bg-emerald-900/40 text-emerald-300/70 border-emerald-800 hover:bg-emerald-900/60'
                  }`}
                >
                  {mode === 'strict' ? '🎯 Strict' : mode === 'balanced' ? '⚖️ Balanced' : '🌐 Broad'}
                </button>
              ))}
            </div>
          </div>

          {/* EXPLANATION / HOW IT WORKS CARD */}
          <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 space-y-2 text-xs text-emerald-200/90 leading-relaxed">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              How Our AI Face Indexing Works
            </div>
            <p>
              When colony photographers upload photos to Cloudflare R2, faces are automatically detected and converted to 128-point biometric vectors. When you provide a selfie, our deep learning engine compares facial landmarks and distances in real-time.
            </p>
          </div>

          {/* BIG MATCH TRIGGER BUTTON (if image is selected) */}
          {selectedImage && !isScanning && (
            <button
              type="button"
              onClick={() => runFaceRecognition(selectedImage)}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-emerald-950 font-black text-sm shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 active:scale-98 border border-yellow-200"
            >
              <Sparkles className="w-5 h-5 text-emerald-950" />
              <span>Find My Photos Now ({filteredPhotos.length} Photos in Scope)</span>
            </button>
          )}

          {scanStatus && (
            <div className="text-xs font-semibold text-amber-300 bg-emerald-900/70 p-3 rounded-xl border border-emerald-700/60 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{scanStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── MATCHED PHOTOS RESULTS GALLERY ── */}
      {hasScanned && (
        <div className="pt-6 border-t border-emerald-800/80 animate-fadeIn">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="text-2xl font-display font-bold text-amber-200 flex items-center gap-2">
                <span>Matched Photos</span>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  {matchedResults.length} Found
                </span>
              </h3>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Click any photo to view in high resolution, download, or share directly to WhatsApp.
              </p>
            </div>

            {matchedResults.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  setSensitivity('relaxed');
                  if (selectedImage) runFaceRecognition(selectedImage);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all"
              >
                Try Broad Search Mode →
              </button>
            )}
          </div>

          {matchedResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matchedResults.map((match, idx) => (
                <div
                  key={match.photo.id || idx}
                  className="group relative rounded-2xl overflow-hidden bg-emerald-950 border border-emerald-700/70 shadow-lg hover:border-amber-400/60 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-emerald-950">
                    <img
                      src={match.photo.thumbnailUrl || match.photo.url}
                      alt={match.photo.title || 'Matched Photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Match Score Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-400/50 shadow-md flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{Math.round(match.similarity * 100)}% Match</span>
                    </div>

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-3">
                      <button
                        type="button"
                        onClick={() => setPreviewPhoto(match.photo)}
                        className="p-2.5 rounded-full bg-emerald-900/90 text-amber-200 hover:bg-emerald-800 transition-all shadow-md"
                        title="Zoom Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadPhoto(match.photo.url, match.photo.title)}
                        className="p-2.5 rounded-full bg-amber-500 text-emerald-950 hover:bg-amber-400 transition-all shadow-md"
                        title="Download HD Photo"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => shareToWhatsApp(match.photo, match.similarity)}
                        className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md"
                        title="Share to WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-900/70 border-t border-emerald-800/60">
                    <h4 className="text-xs font-bold text-amber-100 truncate mb-1">
                      {match.photo.title || 'Festival Moment'}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-emerald-300/80">
                      <span className="truncate">{match.photo.tags?.[0] || 'Celebration'}</span>
                      <button
                        type="button"
                        onClick={() => setPreviewPhoto(match.photo)}
                        className="text-amber-400 font-semibold hover:underline"
                      >
                        View Full
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-emerald-900/30 rounded-2xl border border-emerald-800/50 p-6 space-y-2">
              <p className="text-amber-200 font-bold text-sm">No direct photo matches in this album scope.</p>
              <p className="text-xs text-emerald-300/70 max-w-md mx-auto">
                Try switching to <strong>All Events & Festivals</strong>, or toggle sensitivity to <strong>Broad Search</strong> to scan across all celebrations!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lightbox / Zoom Modal for Matched Photos */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-emerald-950 rounded-3xl overflow-hidden border border-amber-400/40 shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewPhoto.url}
              alt={previewPhoto.title}
              className="w-full max-h-[70vh] object-contain rounded-2xl mb-4 bg-black/40"
            />

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-display font-bold text-amber-200">{previewPhoto.title}</h3>
                <p className="text-xs text-emerald-300/70">
                  {previewPhoto.tags?.join(' • ') || 'Community Festival Photo'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => downloadPhoto(previewPhoto.url, previewPhoto.title)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 font-bold text-xs shadow-md hover:from-amber-400 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download HD</span>
                </button>

                <button
                  type="button"
                  onClick={() => shareToWhatsApp(previewPhoto, 0.95)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}