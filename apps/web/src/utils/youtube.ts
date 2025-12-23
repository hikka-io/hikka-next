/**
 * Extracts the YouTube video ID from various URL formats
 * @param url - YouTube video URL or share link
 * @returns Video ID or null if invalid
 */
export function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    // Patterns to match different YouTube URL formats
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

/**
 * YouTube Thumbnail Quality Options
 */
export type YouTubeThumbnailQuality =
    | 'default' // 120x90
    | 'medium' // 320x180
    | 'high' // 480x360
    | 'standard' // 640x480
    | 'maxres'; // 1280x720

/**
 * Generates a YouTube thumbnail URL
 * @param videoId - YouTube video ID
 * @param quality - Desired thumbnail quality (default: 'medium')
 * @returns Thumbnail URL or null if invalid
 */
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

/**
 * Comprehensive YouTube Thumbnail Parsing Function
 * @param url - YouTube video URL
 * @param quality - Desired thumbnail quality
 * @returns Thumbnail URL or null if invalid
 */
export default function parseYouTubeThumbnail(
    url: string,
    quality: YouTubeThumbnailQuality = 'medium',
): string | null {
    const videoId = extractYouTubeVideoId(url);
    return getYouTubeThumbnail(videoId, quality);
}

