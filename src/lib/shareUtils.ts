/**
 * ============================================================================
 * EventLens AI — WhatsApp & Social Share Helper (shareUtils.ts)
 * ============================================================================
 *
 * PURPOSE:
 *   Provides instant one-tap sharing of event gallery links via WhatsApp,
 *   native mobile share sheet (Web Share API), clipboard, and social media.
 *
 * WHY THIS MATTERS FOR YOUR BUSINESS:
 *   Event photographers and hosts need to distribute gallery links to 100+
 *   guests immediately after (or during) the event. WhatsApp is the dominant
 *   communication channel in India and many other markets.
 *
 * SUPPORTED SHARE METHODS:
 *   1. WhatsApp (deep link) — opens WhatsApp with pre-filled message + link
 *   2. Native Share Sheet — uses device's native share (iOS/Android)
 *   3. Clipboard Copy — copies link for manual pasting
 *   4. Twitter/X Share — opens tweet composer with event link
 *   5. SMS/Text — opens default SMS app with event link
 *
 * CONNECTION MAP:
 *   CALLED BY:
 *     - event/[id]/page.tsx → Share button in gallery header
 *     - QRCodeModal.tsx     → Can add WhatsApp share button alongside QR
 *     - EventCard.tsx       → Can add share action to event cards
 * ============================================================================
 */

import { EventItem } from './types';

/**
 * Generate a shareable event gallery URL.
 *
 * In production (Vercel), this returns the full public URL like:
 *   https://yourapp.vercel.app/event/arav-ananya-wedding
 *
 * In local dev, this returns:
 *   http://localhost:3000/event/arav-ananya-wedding
 */
export function getEventShareUrl(event: EventItem): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://eventlens.live';
  return `${baseUrl}/event/${event.slug || event.id}`;
}

/**
 * Generate a pre-formatted WhatsApp share message with event link.
 *
 * MESSAGE FORMAT:
 *   📸 *Aarav & Ananya Royal Wedding* Photo Gallery is LIVE!
 *   📍 The Oberoi Palace, Udaipur
 *   📅 Aug 24, 2026
 *
 *   View all 200+ high-res photos & use AI to find YOUR photos instantly:
 *   👉 https://eventlens.live/event/arav-ananya-wedding
 *
 *   Powered by EventLens AI ⚡
 */
export function generateWhatsAppMessage(event: EventItem): string {
  const url = getEventShareUrl(event);
  const date = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  let message = `📸 *${event.title}* Photo Gallery is LIVE!\n`;
  if (event.location) {
    message += `📍 ${event.location}\n`;
  }
  message += `📅 ${date}\n\n`;
  message += `View all ${event.photoCount || ''} high-res photos & use AI to find YOUR photos instantly:\n`;
  message += `👉 ${url}\n\n`;
  message += `Powered by EventLens AI ⚡`;
  return message;
}

/**
 * Open WhatsApp with pre-filled event gallery share message.
 *
 * FLOW:
 *   1. Generates formatted message with bold title, location, date, and link
 *   2. Opens WhatsApp deep link (works on both mobile app and WhatsApp Web)
 *   3. Guest can choose a contact or broadcast list to send to
 *
 * @param event - The event to share
 * @param phoneNumber - Optional: pre-fill a specific recipient phone number
 */
export function shareViaWhatsApp(event: EventItem, phoneNumber?: string): void {
  const message = encodeURIComponent(generateWhatsAppMessage(event));
  const url = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${message}`
    : `https://wa.me/?text=${message}`;

  window.open(url, '_blank');
}

/**
 * Share event link using the device's native share sheet (Web Share API).
 *
 * SUPPORTED ON:
 *   - iOS Safari (12+)
 *   - Android Chrome (61+)
 *   - Modern Edge and Samsung Internet
 *
 * Falls back to clipboard copy if Web Share API is not available.
 */
export async function shareViaNativeSheet(event: EventItem): Promise<boolean> {
  const url = getEventShareUrl(event);
  const shareData = {
    title: `${event.title} — Photo Gallery`,
    text: `View all ${event.photoCount || ''} event photos & find your photos with AI! ⚡`,
    url,
  };

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (e) {
      // User cancelled the share sheet — not an error
      if ((e as Error).name !== 'AbortError') {
        console.warn('Native share failed:', e);
      }
      return false;
    }
  }

  // Fallback: copy to clipboard
  return copyToClipboard(url);
}

/**
 * Copy event URL to clipboard with fallback for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (e) {
    console.warn('Clipboard copy failed:', e);
    return false;
  }
}

/**
 * Share event via Twitter/X with pre-filled tweet.
 */
export function shareViaTwitter(event: EventItem): void {
  const url = getEventShareUrl(event);
  const text = encodeURIComponent(
    `Check out the ${event.title} photo gallery! 📸 Find your photos instantly with AI ⚡`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
}

/**
 * Share event via SMS/text message.
 */
export function shareViaSMS(event: EventItem): void {
  const url = getEventShareUrl(event);
  const body = encodeURIComponent(
    `${event.title} Photo Gallery is live! 📸 Find your photos with AI: ${url}`
  );
  window.open(`sms:?body=${body}`, '_self');
}
