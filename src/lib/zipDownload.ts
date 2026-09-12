import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PhotoItem } from './types';

/**
 * Downloads multiple high-resolution photos bundled as a single clean .ZIP archive directly in browser.
 */
export async function downloadPhotosAsZip(
  photos: PhotoItem[],
  zipFilename = 'event-photos.zip',
  onProgress?: (progressPercent: number, currentFileName: string) => void
): Promise<void> {
  if (photos.length === 0) return;

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
 * Download a single photo with original filename
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
