/** Extracts the YouTube video ID from watch/embed/youtu.be URLs (null if none). */
export function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

const YOUTUBE_HOSTS = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
]);
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const START_TIME = /^(?=\d)(?:\d+h)?(?:\d+m)?(?:\d+s?)?$/;
const EMBED_PATH = '/embed/';

const parseUrl = (value: string): URL | null => {
    const trimmed = value.trim();

    try {
        return new URL(trimmed.startsWith('//') ? `https:${trimmed}` : trimmed);
    } catch {
        return null;
    }
};

const pathVideoId = (url: URL): string | null => {
    if (url.hostname === 'youtu.be') return url.pathname.slice(1);
    if (!YOUTUBE_HOSTS.has(url.hostname)) return null;
    if (url.pathname === '/watch') return url.searchParams.get('v');
    if (url.pathname.startsWith(EMBED_PATH)) {
        return url.pathname.slice(EMBED_PATH.length);
    }

    return null;
};

/** One YouTube video as a youtube.com watch url (article save rejects youtu.be), or null. */
export function normalizeYouTubeVideoUrl(value: string): string | null {
    const url = parseUrl(value);

    if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:')) {
        return null;
    }

    const videoId = pathVideoId(url);

    if (!videoId || !VIDEO_ID.test(videoId)) return null;

    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const start = url.searchParams.get('t') ?? url.searchParams.get('start');

    return start && START_TIME.test(start)
        ? `${watchUrl}&t=${start}`
        : watchUrl;
}

export const isYouTubeVideoUrl = (value: string) =>
    normalizeYouTubeVideoUrl(value) !== null;

export type YouTubeThumbnailQuality =
    | 'default' // 120x90
    | 'medium' // 320x180
    | 'high' // 480x360
    | 'standard' // 640x480
    | 'maxres'; // 1280x720

/** Builds a YouTube thumbnail URL for the given video ID and quality. */
export function getYouTubeThumbnail(
    videoId: string | null,
    quality: YouTubeThumbnailQuality = 'medium',
): string | null {
    if (!videoId) return null;

    const thumbnailQualities = {
        default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
        medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        standard: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
        maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    };

    return thumbnailQualities[quality] || thumbnailQualities.medium;
}

/** Extracts the video ID from a URL and returns its thumbnail URL. */
export function parseYouTubeThumbnail(
    url: string,
    quality: YouTubeThumbnailQuality = 'medium',
): string | null {
    const videoId = extractYouTubeVideoId(url);
    return getYouTubeThumbnail(videoId, quality);
}
