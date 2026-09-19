/**
 * ============================================================================
 * EventLens AI — Unified Storage Service (storage.ts)
 * ============================================================================
 *
 * Supports multi-tiered photo storage:
 * 1. Cloudflare R2 Object Storage (Primary / Preferred CDN Storage — zero egress fees)
 * 2. Supabase Cloud Storage (Secondary Fallback)
 * 3. Local In-Memory / Blob URL (Offline Session Fallback)
 */

import { uploadPhotoToCloud, isCloudConfigured as isSupabaseConfigured } from './supabase';

export interface StorageUploadResult {
  publicUrl: string;
  provider: 'r2' | 'supabase' | 'session';
  key?: string;
  error?: string;
}

export interface StorageStatus {
  r2Configured: boolean;
  supabaseConfigured: boolean;
  activeProvider: 'r2' | 'supabase' | 'session';
  bucketName?: string;
  publicUrl?: string;
}

let cachedR2Status: { configured: boolean; checkedAt: number; bucketName?: string; publicUrl?: string } | null = null;

/**
 * Check if Cloudflare R2 is configured on the backend
 */
export async function checkR2Status(): Promise<{
  configured: boolean;
  bucketName?: string;
  publicUrl?: string;
  accountIdMasked?: string;
}> {
  // Cache for 30 seconds to avoid unnecessary round-trips
  const now = Date.now();
  if (cachedR2Status && now - cachedR2Status.checkedAt < 30000) {
    return {
      configured: cachedR2Status.configured,
      bucketName: cachedR2Status.bucketName,
      publicUrl: cachedR2Status.publicUrl,
    };
  }

  try {
    const res = await fetch('/api/upload/r2', { method: 'GET', cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      cachedR2Status = {
        configured: Boolean(data.configured),
        checkedAt: now,
        bucketName: data.bucketName,
        publicUrl: data.publicUrl,
      };
      return data;
    }
  } catch (err) {
    console.warn('R2 status check notice:', err);
  }

  cachedR2Status = { configured: false, checkedAt: now };
  return { configured: false };
}

/**
 * Get overall cloud storage status (R2 vs Supabase vs Session)
 */
export async function getStorageStatus(): Promise<StorageStatus> {
  const r2 = await checkR2Status();
  const supabase = isSupabaseConfigured();

  let activeProvider: 'r2' | 'supabase' | 'session' = 'session';
  if (r2.configured) {
    activeProvider = 'r2';
  } else if (supabase) {
    activeProvider = 'supabase';
  }

  return {
    r2Configured: r2.configured,
    supabaseConfigured: supabase,
    activeProvider,
    bucketName: r2.bucketName,
    publicUrl: r2.publicUrl,
  };
}

/**
 * Upload a photo file using the highest-priority available storage provider:
 * 1. Cloudflare R2
 * 2. Supabase Storage
 * 3. Session fallback
 */
export async function uploadPhoto(
  file: File | Blob,
  fileName: string,
  eventId: string
): Promise<StorageUploadResult> {
  // 1. Attempt Cloudflare R2 Upload
  try {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file, fileName || file.name);
    } else {
      formData.append('file', file, fileName || 'photo.jpg');
    }
    formData.append('eventId', eventId || 'general');

    const res = await fetch('/api/upload/r2', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.publicUrl) {
        return {
          publicUrl: data.publicUrl,
          provider: 'r2',
          key: data.key,
        };
      }
    } else if (res.status === 503) {
      // R2 is not configured on server — proceed to Supabase fallback
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn('Cloudflare R2 upload returned error:', errData);
    }
  } catch (r2Err) {
    console.warn('Cloudflare R2 upload request failed, checking Supabase fallback:', r2Err);
  }

  // 2. Fallback to Supabase Storage if configured
  if (isSupabaseConfigured()) {
    try {
      const supabaseRes = await uploadPhotoToCloud(file, fileName, eventId);
      if (supabaseRes.publicUrl) {
        return {
          publicUrl: supabaseRes.publicUrl,
          provider: 'supabase',
        };
      }
    } catch (sbErr) {
      console.warn('Supabase storage fallback error:', sbErr);
    }
  }

  // 3. Neither cloud provider is configured / successful
  return {
    publicUrl: '',
    provider: 'session',
    error: 'No cloud storage provider configured. Storing in browser session.',
  };
}
