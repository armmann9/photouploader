/**
 * ============================================================================
 * EventLens AI — Face Recognition Neural Network Engine (faceRecognition.ts)
 * ============================================================================
 *
 * State-of-the-art deep learning biometric neural network pipeline:
 * - SSD MobileNet v1 & Tiny Face Detector
 * - 68-Point Facial Landmark Net
 * - ResNet-34 128-Dimensional Biometric Embedding Vector Extractor
 *
 * Runs 100% client-side via WebGL with zero server GPU latency and privacy-first design.
 */

let faceapi: any = null;
let modelsLoaded = false;
let modelLoadingPromise: Promise<boolean> | null = null;

const LOCAL_MODEL_URL = '/models';
const CDN_MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

/**
 * Calibrated match thresholds for 128-d ResNet face embeddings
 */
export type MatchSensitivity = 'strict' | 'balanced' | 'relaxed';

export const SENSITIVITY_THRESHOLDS: Record<MatchSensitivity, { distance: number; cosine: number }> = {
  strict: { distance: 0.48, cosine: 0.86 },
  balanced: { distance: 0.58, cosine: 0.78 }, // Recommended default for real-world lighting/glasses
  relaxed: { distance: 0.65, cosine: 0.70 },
};

export const DEFAULT_DISTANCE_THRESHOLD = SENSITIVITY_THRESHOLDS.balanced.distance;
export const DEFAULT_COSINE_THRESHOLD = SENSITIVITY_THRESHOLDS.balanced.cosine;

/**
 * Load Face API neural network models from local static assets or fallback CDN
 */
export async function loadFaceApiModels(): Promise<boolean> {
  if (modelsLoaded) return true;
  if (modelLoadingPromise) return modelLoadingPromise;

  modelLoadingPromise = (async () => {
    try {
      if (typeof window === 'undefined') return false;

      faceapi = await import('@vladmandic/face-api');

      // 1. Try local models folder first (instant & offline capable)
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(LOCAL_MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(LOCAL_MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(LOCAL_MODEL_URL),
          faceapi.nets.tinyFaceDetector.loadFromUri(LOCAL_MODEL_URL).catch(() => {}),
        ]);
        modelsLoaded = true;
        console.log('⚡ [EventLens AI] Neural networks loaded from local models directory.');
        return true;
      } catch (localErr) {
        console.warn('⚠️ [EventLens AI] Local model load failed, falling back to CDN...', localErr);
      }

      // 2. Fallback to CDN
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(CDN_MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(CDN_MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(CDN_MODEL_URL),
        faceapi.nets.tinyFaceDetector.loadFromUri(CDN_MODEL_URL).catch(() => {}),
      ]);

      modelsLoaded = true;
      console.log('⚡ [EventLens AI] Neural networks loaded from CDN.');
      return true;
    } catch (err) {
      console.error('❌ [EventLens AI] Could not load face recognition neural network models:', err);
      modelsLoaded = false;
      return false;
    }
  })();

  return modelLoadingPromise;
}

export interface DetectedFaceDescriptor {
  box: { x: number; y: number; width: number; height: number };
  descriptor: number[];
  confidence: number;
}

/**
 * Resize canvas/image to optimal processing size to prevent WebGL memory spikes
 */
function getResizedCanvas(input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, maxDim = 1280): HTMLCanvasElement {
  const width = 'videoWidth' in input ? input.videoWidth : input.width;
  const height = 'videoHeight' in input ? input.videoHeight : input.height;

  if (width <= maxDim && height <= maxDim) {
    if (input instanceof HTMLCanvasElement) return input;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(input, 0, 0);
    return canvas;
  }

  const scale = Math.min(maxDim / width, maxDim / height);
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(input, 0, 0, targetW, targetH);
  }
  return canvas;
}

/**
 * Detect all faces in an image and extract 128-d facial embedding vectors
 */
export async function detectFacesAndExtractEmbeddings(
  input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<DetectedFaceDescriptor[]> {
  const isLoaded = await loadFaceApiModels();
  if (!isLoaded || !faceapi) return [];

  try {
    const canvas = getResizedCanvas(input, 1400);

    // Primary: SSD MobileNet with broad sensitivity
    let detections = await faceapi
      .detectAllFaces(canvas, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.25 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Fallback: TinyFaceDetector if SSD MobileNet found 0 faces
    if ((!detections || detections.length === 0) && faceapi.nets.tinyFaceDetector.isLoaded) {
      detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.20 }))
        .withFaceLandmarks()
        .withFaceDescriptors();
    }

    if (!detections || detections.length === 0) return [];

    return detections
      .filter((d: any) => d.detection.box.width >= 24 && d.detection.box.height >= 24)
      .map((d: any) => ({
        box: {
          x: Math.round(d.detection.box.x),
          y: Math.round(d.detection.box.y),
          width: Math.round(d.detection.box.width),
          height: Math.round(d.detection.box.height),
        },
        descriptor: Array.from(d.descriptor),
        confidence: d.detection.score,
      }));
  } catch (e) {
    console.warn('Face detection processing warning:', e);
    return [];
  }
}

/**
 * Extract single face descriptor from a user's selfie (picks largest face in frame)
 */
export async function extractSelfieDescriptor(
  input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<DetectedFaceDescriptor | null> {
  const isLoaded = await loadFaceApiModels();
  if (!isLoaded || !faceapi) return null;

  try {
    const canvas = getResizedCanvas(input, 1280);

    // Primary: SSD MobileNet v1
    let detections = await faceapi
      .detectAllFaces(canvas, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.22 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Secondary fallback: TinyFaceDetector
    if ((!detections || detections.length === 0) && faceapi.nets.tinyFaceDetector.isLoaded) {
      detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.18 }))
        .withFaceLandmarks()
        .withFaceDescriptors();
    }

    if (!detections || detections.length === 0) return null;

    // Pick largest face by bounding box area
    detections.sort((a: any, b: any) => {
      const areaA = a.detection.box.width * a.detection.box.height;
      const areaB = b.detection.box.width * b.detection.box.height;
      return areaB - areaA;
    });

    const primaryFace = detections[0];
    return {
      box: {
        x: Math.round(primaryFace.detection.box.x),
        y: Math.round(primaryFace.detection.box.y),
        width: Math.round(primaryFace.detection.box.width),
        height: Math.round(primaryFace.detection.box.height),
      },
      descriptor: Array.from(primaryFace.descriptor),
      confidence: primaryFace.detection.score,
    };
  } catch (e) {
    console.warn('Selfie face extraction warning:', e);
    return null;
  }
}

/**
 * Compute Euclidean Distance between two 128-d face descriptor vectors
 */
export function calculateEuclideanDistance(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 999;

  let sumSquaredDiff = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sumSquaredDiff += diff * diff;
  }
  return Math.sqrt(sumSquaredDiff);
}

/**
 * Compute Cosine Similarity between two 128-d face descriptor vectors
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Calibrated biometric match evaluator supporting sensitivity presets
 */
export function evaluateFaceMatch(
  vecA: number[],
  vecB: number[],
  sensitivity: MatchSensitivity = 'balanced'
): {
  isMatch: boolean;
  similarityScore: number;
  distance: number;
  cosineSimilarity: number;
} {
  const distance = calculateEuclideanDistance(vecA, vecB);
  const cosine = calculateCosineSimilarity(vecA, vecB);

  const threshold = SENSITIVITY_THRESHOLDS[sensitivity] || SENSITIVITY_THRESHOLDS.balanced;

  // Calibrated biometric match condition
  const isMatch = distance <= threshold.distance && cosine >= threshold.cosine;

  // Calculate percentage similarity score (0.0 to 1.0)
  let similarityScore = 0;
  if (distance <= 0.20) {
    similarityScore = 0.98 + (0.20 - distance) * 0.05; // 98% - 99%
  } else if (distance <= 0.35) {
    similarityScore = 0.93 + (0.35 - distance) * 0.33; // 93% - 98%
  } else if (distance <= 0.48) {
    similarityScore = 0.86 + (0.48 - distance) * 0.53; // 86% - 93%
  } else if (distance <= 0.58) {
    similarityScore = 0.77 + (0.58 - distance) * 0.90; // 77% - 86%
  } else if (distance <= 0.65) {
    similarityScore = 0.68 + (0.65 - distance) * 1.28; // 68% - 77%
  } else {
    similarityScore = Math.max(0.1, 1 - distance / 1.0);
  }

  similarityScore = Math.max(0.01, Math.min(0.99, similarityScore));

  return {
    isMatch,
    similarityScore,
    distance,
    cosineSimilarity: cosine,
  };
}

export function calculateEuclideanMatchScore(vecA: number[], vecB: number[]): number {
  return evaluateFaceMatch(vecA, vecB).similarityScore;
}

/**
 * Generate HTMLImageElement with CORS safety and memory cleanup
 */
export function createImageElementFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(e);
    };

    img.src = objectUrl;
  });
}

/**
 * Load remote image safely with fallback for CORS-restricted hosts
 */
export function loadSafeImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => {
      // Try again without crossOrigin
      const retryImg = new Image();
      retryImg.onload = () => resolve(retryImg);
      retryImg.onerror = () => resolve(null);
      retryImg.src = url;
    };

    img.src = url;
  });
}
