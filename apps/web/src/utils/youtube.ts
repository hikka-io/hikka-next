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
export default function parseYouTubeThumbnail(
    url: string,
    quality: YouTubeThumbnailQuality = 'medium',
): string | null {
    const videoId = extractYouTubeVideoId(url);
    return getYouTubeThumbnail(videoId, quality);
}
