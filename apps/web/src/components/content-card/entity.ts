import {
    type CharacterResponse,
    ContentTypeEnum,
    type PersonResponse,
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';

import { resolveTrackingEntry } from '@/utils/api/tracking-entry';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import type { MediaTooltipItem, MediaTooltipItemOf } from './tooltips';

/**
 * What a card is about. The tracking entry is separate from `data` because the
 * responses that nest content inside a list entry (userlist, feed) carry it on
 * the entry rather than on the content itself.
 */
export type CardEntity =
    | {
          type: typeof ContentTypeEnum.ANIME;
          data: MediaTooltipItemOf<'anime'>;
          watch?: WatchResponseBase | null;
      }
    | {
          type: typeof ContentTypeEnum.MANGA;
          data: MediaTooltipItemOf<'manga'>;
          read?: ReadResponseBase | null;
      }
    | {
          type: typeof ContentTypeEnum.NOVEL;
          data: MediaTooltipItemOf<'novel'>;
          read?: ReadResponseBase | null;
      }
    | { type: typeof ContentTypeEnum.CHARACTER; data: CharacterResponse }
    | { type: typeof ContentTypeEnum.PERSON; data: PersonResponse };

/** Builds the entity for payloads that already discriminate on `data_type`. */
export function contentEntity(
    data: MediaTooltipItem | CharacterResponse | PersonResponse,
): CardEntity {
    switch (data.data_type) {
        case ContentTypeEnum.ANIME:
            return { type: ContentTypeEnum.ANIME, data };
        case ContentTypeEnum.MANGA:
            return { type: ContentTypeEnum.MANGA, data };
        case ContentTypeEnum.NOVEL:
            return { type: ContentTypeEnum.NOVEL, data };
        case ContentTypeEnum.CHARACTER:
            return { type: ContentTypeEnum.CHARACTER, data };
        default:
            return { type: ContentTypeEnum.PERSON, data };
    }
}

export type ResolvedEntity = {
    slug: string;
    content_type: ContentTypeEnum;
    href: string;
    image: string | null;
    tooltipItem?: MediaTooltipItem;
    watch?: WatchResponseBase | null;
    read?: ReadResponseBase | null;
};

/**
 * Everything a card needs about its subject, derived in one place so a new
 * content type is a new arm here rather than an edit at every call site.
 */
export function resolveEntity(entity: CardEntity): ResolvedEntity {
    const { slug, image } = entity.data;

    const base = {
        slug,
        image,
        content_type: entity.type,
        href: `${CONTENT_TYPE_LINKS[entity.type]}/${slug}`,
    };

    if (
        entity.type === ContentTypeEnum.CHARACTER ||
        entity.type === ContentTypeEnum.PERSON
    ) {
        return base;
    }

    const media = { ...base, tooltipItem: entity.data };

    if (entity.type === ContentTypeEnum.ANIME) {
        return {
            ...media,
            watch: resolveTrackingEntry(
                entity.watch,
                'watch' in entity.data
                    ? (entity.data.watch[0] ?? null)
                    : undefined,
            ),
        };
    }

    return {
        ...media,
        read: resolveTrackingEntry(
            entity.read,
            'read' in entity.data ? (entity.data.read[0] ?? null) : undefined,
        ),
    };
}
