import type {
    ContentTypeEnum,
    ReadResponseBase,
    WatchResponseBase,
} from '@hikka/api';

import type { ContentCardProps } from './content-card';
import type { MediaTooltipItem } from './tooltips';

const TRACKING_KEY = {
    anime: 'watch',
    manga: 'read',
    novel: 'read',
} as const satisfies Record<MediaTooltipItem['data_type'], 'watch' | 'read'>;

/**
 * The tooltip can serve itself from a list item only when that item carries
 * both `genres` and its tracking array — some responses declare the full shape
 * but ship content without `watch`/`read`, and those must keep fetching.
 */
export function getTooltipItem<T extends string>(
    entity: { data_type: string } | null | undefined,
    dataType: T,
): Extract<MediaTooltipItem, { data_type: T }> | undefined {
    if (!entity || entity.data_type !== dataType) return undefined;

    const trackingKey = TRACKING_KEY[dataType as MediaTooltipItem['data_type']];

    if (!trackingKey || !('genres' in entity) || !(trackingKey in entity)) {
        return undefined;
    }

    return entity as Extract<MediaTooltipItem, { data_type: T }>;
}

interface MediaEntity {
    slug: string;
    image?: string | null;
    year?: number | null;
    media_type?: string | null;
}

interface MediaCardConfig {
    contentType: ContentTypeEnum;
    basePath: string;
    mediaTypeMap: Record<string, { title_ua: string }>;
}

export function getMediaCardProps(
    entity: MediaEntity,
    config: MediaCardConfig,
    status?: {
        watch?: WatchResponseBase | null;
        read?: ReadResponseBase | null;
    },
): Partial<ContentCardProps> {
    return {
        slug: entity.slug,
        content_type: config.contentType,
        withContextMenu: true,
        href: `${config.basePath}/${entity.slug}`,
        image: entity.image ?? undefined,
        leftSubtitle: entity.year ? String(entity.year) : undefined,
        rightSubtitle: entity.media_type
            ? config.mediaTypeMap[entity.media_type]?.title_ua
            : undefined,
        ...status,
    };
}
