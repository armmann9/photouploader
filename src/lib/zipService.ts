import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PhotoItem } from './types';
import { FESTIVAL_EVENTS } from '@/data/festivalEvents';

/**
 * ============================================================================
 * EventLens AI / BPSCVS — Unified Zip Download Service (zipService.ts)
 * ============================================================================
 */

/**
 * Downloads multiple high-resolution photos bundled as a single clean .ZIP archive directly in browser.
 */
export async function downloadPhotosAsZip(
  photos: PhotoItem[],
  zipFilename = 'event-photos.zip',
  onProgress?: (progressPercent: number, currentFileName: string) => void
): Promise<void> {
  if (!photos || photos.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('photos') || zip;

  let completed = 0;
  const total = photos.length;

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const fileName = `photo_${i + 1}_${photo.id.slice(-6)}.jpg`;

    if (onProgress) {
      onProgress(Math.round((completed / total) * 80), `Downloading ${i + 1}/${total}...`);
    }

    try {
      // Fetch the photo blob (from Supabase CDN or public image URL)
      const res = await fetch(photo.url);
      const blob = await res.blob();
      folder.file(fileName, blob);
    } catch (err) {
      console.warn(`Failed to fetch photo ${photo.url} for ZIP, retrying with thumbnail...`, err);
      try {
        const res = await fetch(photo.thumbnailUrl);
        const blob = await res.blob();
        folder.file(fileName, blob);
      } catch (innerErr) {
        console.error('Could not download image:', innerErr);
      }
    }

    completed++;
  }

  if (onProgress) {
    onProgress(90, 'Compressing ZIP package...');
  }

  const zipContent = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(90 + Math.round(metadata.percent * 0.1), 'Finalizing...');
    }
  });

  saveAs(zipContent, zipFilename);

  if (onProgress) {
    onProgress(100, 'Download complete!');
  }
}

/**
 * Download a single photo with original or custom filename
 */
export async function downloadSinglePhoto(photo: PhotoItem, customName?: string): Promise<void> {
  try {
    const res = await fetch(photo.url);
    const blob = await res.blob();
    const fileName = customName || `event_photo_${photo.id}.jpg`;
    saveAs(blob, fileName);
  } catch (err) {
    // Direct link fallback
    const a = document.createElement('a');
    a.href = photo.url;
    a.download = customName || `event_photo_${photo.id}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Packages project assets, festival panchang, and photo metadata into a downloadable .zip archive.
 */
export async function downloadProjectArchiveZip(onProgress?: (message: string) => void): Promise<void> {
  if (typeof window === 'undefined') return;

  const zip = new JSZip();

  if (onProgress) onProgress('Initializing Utsav Hub Archive...');

  // Add Project Documentation & Society Info
  zip.file(
    'README.md',
    `# Utsav Hub - Bani Park Sindhi Colony Vikas Samiti (BPSCVS)

Official Community Portal & AI Photo Hub.
- Deepotsav & Festival Celebrations
- AI Face Match Photo Search
- Live Mahaprasad RSVP & Meal Counter
- Committee Directory & 24/7 Helpline Desk

Built for community harmony and celebration preservation.
`
  );

  zip.file(
    'SOCIETY_PANCHANG_2025_2026.json',
    JSON.stringify(
      FESTIVAL_EVENTS.map((e) => ({
        festival: e.title,
        hindi: e.hindiTitle,
        date: e.date,
        location: e.location,
        attendees: e.attendeesCount,
        highlights: e.highlights,
      })),
      null,
      2
    )
  );

  if (onProgress) onProgress('Packaging festival archives & metadata...');

  // Include album metadata
  const photosFolder = zip.folder('festival_albums');
  if (photosFolder) {
    FESTIVAL_EVENTS.forEach((event) => {
      const eventFolder = photosFolder.folder(event.id);
      if (eventFolder) {
        eventFolder.file(
          'details.json',
          JSON.stringify(
            {
              title: event.title,
              hindiTitle: event.hindiTitle,
              date: event.date,
              description: event.description,
              photoCount: event.photoCount,
              highlights: event.highlights,
              photos: event.photos.map((p) => ({
                id: p.id,
                url: p.url,
                caption: p.caption,
                tags: p.tags,
              })),
            },
            null,
            2
          )
        );
      }
    });
  }

  if (onProgress) onProgress('Generating compressed ZIP package...');

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(`Compressing: ${Math.round(metadata.percent)}%`);
    }
  });

  saveAs(content, 'utsav-hub-bpscvs-portal.zip');

  if (onProgress) onProgress('Download ready!');
}

/** Alias for backward compatibility */
export const downloadProjectZip = downloadProjectArchiveZip;
