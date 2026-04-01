import {
    ContentTypeEnum,
    ReadResponseBase,
    WatchResponseBase,
} from '@hikka/client';

import { ContentCardProps } from './content-card';

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
    status?: { watch?: WatchResponseBase; read?: ReadResponseBase },
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
