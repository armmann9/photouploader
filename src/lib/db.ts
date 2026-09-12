/**
 * ============================================================================
 * EventLens AI — Unified Data Access Layer (db.ts)
 * ============================================================================
 *
 * PURPOSE:
 *   This is the single source of truth for ALL data reads and writes across
 *   the entire application. Every component that needs event or photo data
 *   goes through this module — never directly to Supabase or localStorage.
 *
 * DUAL-MODE STRATEGY:
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  Priority 1: Supabase Cloud (if credentials are configured) │
 *   │    → Queries PostgreSQL `events` and `photos` tables        │
 *   │    → Real-time cloud data, accessible from any device       │
 *   │                                                             │
 *   │  Priority 2: localStorage Fallback (if no cloud credentials)│
 *   │    → Persists data in browser localStorage                  │
 *   │    → Seeded with curated sample data from sampleData.ts     │
 *   │    → Perfect for instant demo/testing with zero setup       │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * CONNECTION MAP:
 *   READS FROM:
 *     - supabase.ts → getSupabaseClient() for cloud queries
 *     - sampleData.ts → INITIAL_EVENTS, INITIAL_PHOTOS for first-run seeding
 *     - localStorage → cached events/photos for offline/demo mode
 *
 *   CALLED BY:
 *     - page.tsx (home)       → getAllEvents() to display event cards
 *     - event/[id]/page.tsx   → getEventById(), getPhotosByEventId()
 *     - admin/page.tsx        → getAllEvents(), createEvent()
 *     - admin/upload/[id]     → getEventById(), getPhotosByEventId(), savePhotos()
 *     - BulkUploader.tsx      → savePhotos(), updatePhotoFaces()
 *
 *   WRITES TO:
 *     - Supabase `events` table (INSERT/UPDATE)
 *     - Supabase `photos` table (UPSERT with face embeddings)
 *     - localStorage (mirror writes for offline resilience)
 * ============================================================================
 */

import { EventItem, PhotoItem } from './types';
import { INITIAL_EVENTS, INITIAL_PHOTOS } from './sampleData';
import { getSupabaseClient } from './supabase';

/** localStorage key for persisting event data between sessions */
const EVENTS_STORAGE_KEY = 'eventlens_events_data';
/** localStorage key for persisting photo data between sessions */
const PHOTOS_STORAGE_KEY = 'eventlens_photos_data';

/**
 * In-memory cache layer for instant UI responsiveness.
 * Prevents redundant localStorage JSON.parse calls on rapid state updates.
 * Invalidated on new writes (createEvent, savePhotos).
 */
let memoryEvents: EventItem[] | null = null;
let memoryPhotos: PhotoItem[] | null = null;

function getLocalStorage(): Storage | null {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

/**
 * Get all events (from Supabase if connected, else LocalStorage/Initial dataset)
 */
export async function getAllEvents(): Promise<EventItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          slug: row.slug || row.id,
          title: row.title,
          description: row.description,
          date: row.date,
          location: row.location,
          coverImage: row.cover_image,
          category: row.category || 'Other',
          photoCount: row.photo_count || 0,
          pinCode: row.pin_code,
          isPublic: row.is_public ?? true,
          createdAt: row.created_at,
          photographerName: row.photographer_name,
          photographerContact: row.photographer_contact,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch events fallback:', e);
    }
  }

  // Fallback to local storage / memory
  const ls = getLocalStorage();
  if (ls) {
    const raw = ls.getItem(EVENTS_STORAGE_KEY);
    if (raw) {
      try {
        memoryEvents = JSON.parse(raw);
        return memoryEvents || INITIAL_EVENTS;
      } catch (e) {
        console.error('Failed to parse local events:', e);
      }
    }
  }

  if (!memoryEvents) {
    memoryEvents = [...INITIAL_EVENTS];
    if (ls) {
      ls.setItem(EVENTS_STORAGE_KEY, JSON.stringify(memoryEvents));
    }
  }
  return memoryEvents;
}

/**
 * Get event by ID or Slug
 */
export async function getEventById(idOrSlug: string): Promise<EventItem | null> {
  const events = await getAllEvents();
  return events.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || null;
}

/**
 * Create a new event
 */
export async function createEvent(newEvent: Omit<EventItem, 'id' | 'createdAt' | 'photoCount'>): Promise<EventItem> {
  const eventItem: EventItem = {
    ...newEvent,
    id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    photoCount: 0,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('events').insert([
        {
          id: eventItem.id,
          slug: eventItem.slug,
          title: eventItem.title,
          description: eventItem.description,
          date: eventItem.date,
          location: eventItem.location,
          cover_image: eventItem.coverImage,
          category: eventItem.category,
          photo_count: 0,
          pin_code: eventItem.pinCode,
          is_public: eventItem.isPublic,
          photographer_name: eventItem.photographerName,
          photographer_contact: eventItem.photographerContact,
        }
      ]);
    } catch (e) {
      console.warn('Supabase event insert fallback:', e);
    }
  }

  const events = await getAllEvents();
  const updated = [eventItem, ...events];
  memoryEvents = updated;
  const ls = getLocalStorage();
  if (ls) {
    ls.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
  }

  return eventItem;
}

/**
 * Get all photos for an event
 */
export async function getPhotosByEventId(eventId: string): Promise<PhotoItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('event_id', eventId)
        .order('uploaded_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          eventId: row.event_id,
          url: row.url,
          thumbnailUrl: row.thumbnail_url || row.url,
          title: row.title,
          width: row.width,
          height: row.height,
          sizeBytes: row.size_bytes,
          uploadedAt: row.uploaded_at,
          tags: row.tags || [],
          faces: row.faces || [],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch photos fallback:', e);
    }
  }

  const ls = getLocalStorage();
  if (ls) {
    const raw = ls.getItem(PHOTOS_STORAGE_KEY);
    if (raw) {
      try {
        const allPhotos: PhotoItem[] = JSON.parse(raw);
        const filtered = allPhotos.filter((p) => p.eventId === eventId);
        if (filtered.length > 0) return filtered;
      } catch (e) {}
    }
  }

  // Check initial photos
  return INITIAL_PHOTOS.filter((p) => p.eventId === eventId);
}

/**
 * Save new photos in bulk to the database
 */
export async function savePhotos(newPhotos: PhotoItem[]): Promise<void> {
  if (newPhotos.length === 0) return;

  const eventId = newPhotos[0].eventId;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const dbRows = newPhotos.map((p) => ({
        id: p.id,
        event_id: p.eventId,
        url: p.url,
        thumbnail_url: p.thumbnailUrl,
        title: p.title,
        width: p.width,
        height: p.height,
        size_bytes: p.sizeBytes,
        uploaded_at: p.uploadedAt,
        tags: p.tags,
        faces: p.faces,
      }));

      await supabase.from('photos').upsert(dbRows);

      // Increment photo count on the event
      await supabase.rpc('increment_event_photo_count', {
        event_id_input: eventId,
        count_add: newPhotos.length,
      });
    } catch (e) {
      console.warn('Supabase save photos fallback:', e);
    }
  }

  // Update local storage
  const ls = getLocalStorage();
  let allPhotos: PhotoItem[] = [...INITIAL_PHOTOS];
  if (ls) {
    const raw = ls.getItem(PHOTOS_STORAGE_KEY);
    if (raw) {
      try {
        allPhotos = JSON.parse(raw);
      } catch (e) {}
    }
  }

  // Append new photos
  const merged = [...newPhotos, ...allPhotos.filter(p => !newPhotos.some(np => np.id === p.id))];
  if (ls) {
    ls.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(merged));
  }

  // Update event photo count locally
  const events = await getAllEvents();
  const targetEvent = events.find(e => e.id === eventId);
  if (targetEvent) {
    targetEvent.photoCount = (targetEvent.photoCount || 0) + newPhotos.length;
    if (ls) {
      ls.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }
}

/**
 * Update face embeddings for a photo after AI background indexing
 */
export async function updatePhotoFaces(photoId: string, faces: PhotoItem['faces']): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('photos').update({ faces }).eq('id', photoId);
    } catch (e) {
      console.warn('Supabase update faces fallback:', e);
    }
  }

  const ls = getLocalStorage();
  if (ls) {
    const raw = ls.getItem(PHOTOS_STORAGE_KEY);
    if (raw) {
      try {
        const allPhotos: PhotoItem[] = JSON.parse(raw);
        const idx = allPhotos.findIndex(p => p.id === photoId);
        if (idx !== -1) {
          allPhotos[idx].faces = faces;
          ls.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(allPhotos));
        }
      } catch (e) {}
    }
  }
}
