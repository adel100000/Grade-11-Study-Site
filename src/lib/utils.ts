import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind merge + clsx helper
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a standard YouTube URL into an embed URL for iframe
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEOID
 * - https://youtu.be/VIDEOID
 * - https://www.youtube.com/embed/VIDEOID
 * @param url Full YouTube link
 * @returns Embed URL e.g. https://www.youtube.com/embed/VIDEOID
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;

  try {
    // Remove any extra query params after the video ID
    let videoId: string | null = null;

    const standardMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);

    if (standardMatch) videoId = standardMatch[1];
    else if (shortMatch) videoId = shortMatch[1];
    else if (embedMatch) videoId = embedMatch[1];

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}
