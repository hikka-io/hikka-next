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

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const TIME_PART = /(\d+)([hms]?)/g;
const SECONDS_PER_UNIT: Record<string, number> = {
    h: 3600,
    m: 60,
    s: 1,
    '': 1,
};

/** `1h2m3s`, `1m5s`, `42s` or `42` as seconds. */
const toSeconds = (time: string) =>
    [...time.matchAll(TIME_PART)].reduce(
        (sum, [, value, unit]) => sum + Number(value) * SECONDS_PER_UNIT[unit],
        0,
    );

const videoParts = (url: URL | null) => {
    if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:')) {
        return null;
    }

    const id = pathVideoId(url);
    if (!id || !VIDEO_ID.test(id)) return null;

    const time = url.searchParams.get('t') ?? url.searchParams.get('start');

    return { id, time: time && START_TIME.test(time) ? time : undefined };
};

/** One YouTube video as a watch url on the bare youtube.com host, the only one article save accepts, or null. */
export function normalizeYouTubeVideoUrl(value: string): string | null {
    const parts = videoParts(parseUrl(value));
    if (!parts) return null;

    const watchUrl = `https://youtube.com/watch?v=${parts.id}`;

    return parts.time ? `${watchUrl}&t=${parts.time}` : watchUrl;
}

/**
 * The video and start time of a saved url. More lenient than the normalizer,
 * since stored urls predate it (some have no scheme).
 */
export function readYouTubeVideo(
    value: string,
): { id: string; start?: number } | null {
    const trimmed = value.trim();
    const parts = videoParts(
        parseUrl(HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`),
    );
    if (!parts) return null;

    return {
        id: parts.id,
        start: parts.time ? toSeconds(parts.time) : undefined,
    };
}

export const isYouTubeVideoUrl = (value: string) =>
    normalizeYouTubeVideoUrl(value) !== null;

/** The YouTube page a video thumbnail opens, starting where the author set it. */
export const youTubeWatchUrl = (id: string, start?: number) =>
    `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ''}`;

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
    return getYouTubeThumbnail(readYouTubeVideo(url)?.id ?? null, quality);
}
