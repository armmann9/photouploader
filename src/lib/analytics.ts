/**
 * ============================================================================
 * EventLens AI — Event Analytics & Engagement Tracker (analytics.ts)
 * ============================================================================
 *
 * PURPOSE:
 *   Tracks and persists key engagement metrics for each event so photographers
 *   and hosts can see exactly how their guests interacted with the gallery.
 *
 * TRACKED METRICS:
 *   - Gallery Page Views (how many times the event was opened)
 *   - AI Face Searches (how many guests used "Find My Photos")
 *   - Photo Downloads (single + ZIP bundle downloads)
 *   - QR Code Scans (how many guests entered via venue QR code)
 *
 * STORAGE:
 *   - Primary: Supabase `event_analytics` table (when cloud is configured)
 *   - Fallback: localStorage (for demo/local mode)
 *
 * CONNECTION MAP:
 *   CALLED BY:
 *     - event/[id]/page.tsx     → trackPageView(), trackAISearch()
 *     - GalleryGrid.tsx         → trackDownload()
 *     - zipDownload.ts          → trackDownload()
 *     - QRCodeModal.tsx         → trackQRScan()
 *
 *   DISPLAYED BY:
 *     - admin/page.tsx          → getEventAnalytics() for dashboard stats
 *     - admin/upload/[id]       → getEventAnalytics() for event detail stats
 * ============================================================================
 */

import { getSupabaseClient } from './supabase';

/** localStorage key prefix for analytics counters */
const ANALYTICS_KEY_PREFIX = 'eventlens_analytics_';

export interface AnalyticsData {
  eventId: string;
  pageViews: number;
  aiSearches: number;
  photoDownloads: number;
  qrScans: number;
  lastUpdated: string;
}

/**
 * Get analytics data for a specific event.
 *
 * PRIORITY:
 *   1. Supabase `event_analytics` table (if cloud is connected)
 *   2. localStorage counters (demo/local fallback)
 */
export async function getEventAnalytics(eventId: string): Promise<AnalyticsData> {
  const defaultData: AnalyticsData = {
    eventId,
    pageViews: 0,
    aiSearches: 0,
    photoDownloads: 0,
    qrScans: 0,
    lastUpdated: new Date().toISOString(),
  };

  // Try Supabase first
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('event_analytics')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (!error && data) {
        return {
          eventId: data.event_id,
          pageViews: data.page_views || 0,
          aiSearches: data.ai_searches || 0,
          photoDownloads: data.photo_downloads || 0,
          qrScans: data.qr_scans || 0,
          lastUpdated: data.last_updated || new Date().toISOString(),
        };
      }
    } catch (e) {
      // Fallback to local storage
    }
  }

  // Fallback: localStorage
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(ANALYTICS_KEY_PREFIX + eventId);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
  }

  return defaultData;
}

/**
 * Increment a specific analytics metric for an event.
 *
 * FLOW:
 *   1. Reads current analytics data
 *   2. Increments the specified metric by 1
 *   3. Writes back to Supabase (cloud) and localStorage (cache)
 *
 * @param eventId - The event to track
 * @param metric  - Which metric to increment
 */
export async function trackMetric(
  eventId: string,
  metric: 'pageViews' | 'aiSearches' | 'photoDownloads' | 'qrScans'
): Promise<void> {
  if (!eventId) return;

  const current = await getEventAnalytics(eventId);
  current[metric] += 1;
  current.lastUpdated = new Date().toISOString();

  // Persist to localStorage (always, for resilience)
  if (typeof window !== 'undefined') {
    localStorage.setItem(ANALYTICS_KEY_PREFIX + eventId, JSON.stringify(current));
  }

  // Persist to Supabase (if connected)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('event_analytics').upsert({
        event_id: eventId,
        page_views: current.pageViews,
        ai_searches: current.aiSearches,
        photo_downloads: current.photoDownloads,
        qr_scans: current.qrScans,
        last_updated: current.lastUpdated,
      });
    } catch (e) {
      // localStorage fallback is already saved, so this is non-critical
      console.warn('[Analytics] Supabase write failed, using localStorage only:', e);
    }
  }
}

// ============================================================================
// Convenience Helper Functions (called directly by components)
// ============================================================================

/** Track when a guest opens an event gallery page */
export const trackPageView = (eventId: string) => trackMetric(eventId, 'pageViews');

/** Track when a guest performs an AI "Find My Photos" face scan */
export const trackAISearch = (eventId: string) => trackMetric(eventId, 'aiSearches');

/** Track when a guest downloads a photo (single or ZIP) */
export const trackDownload = (eventId: string) => trackMetric(eventId, 'photoDownloads');

/** Track when a guest scans the event QR code */
export const trackQRScan = (eventId: string) => trackMetric(eventId, 'qrScans');

/**
 * Get aggregated analytics across ALL events (for the admin dashboard summary).
 *
 * FLOW:
 *   1. Reads all event IDs from the database
 *   2. Sums up all per-event metrics
 *   3. Returns totals for pageViews, aiSearches, photoDownloads, qrScans
 */
export async function getGlobalAnalytics(): Promise<{
  totalPageViews: number;
  totalAISearches: number;
  totalDownloads: number;
  totalQRScans: number;
}> {
  const totals = {
    totalPageViews: 0,
    totalAISearches: 0,
    totalDownloads: 0,
    totalQRScans: 0,
  };

  // Try cloud first
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('event_analytics')
        .select('page_views, ai_searches, photo_downloads, qr_scans');

      if (!error && data) {
        for (const row of data) {
          totals.totalPageViews += row.page_views || 0;
          totals.totalAISearches += row.ai_searches || 0;
          totals.totalDownloads += row.photo_downloads || 0;
          totals.totalQRScans += row.qr_scans || 0;
        }
        return totals;
      }
    } catch (e) {}
  }

  // Fallback: scan localStorage for analytics keys
  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ANALYTICS_KEY_PREFIX)) {
        try {
          const data: AnalyticsData = JSON.parse(localStorage.getItem(key) || '{}');
          totals.totalPageViews += data.pageViews || 0;
          totals.totalAISearches += data.aiSearches || 0;
          totals.totalDownloads += data.photoDownloads || 0;
          totals.totalQRScans += data.qrScans || 0;
        } catch (e) {}
      }
    }
  }

  return totals;
}
