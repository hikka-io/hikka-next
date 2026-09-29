import { useQuery } from '@tanstack/react-query';

import { ContentTypeEnum, type EditContentTypeEnum } from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import type { EditMainContent } from './types';

/**
 * Fetch the editable content for a slug via the type-appropriate detail endpoint.
 * Detail endpoints return supersets of `EditMainContent`; the edit UI reads only the
 * shared subset, so the result is narrowed to the shared union.
 */
export function useContentBySlug(
    contentType: EditContentTypeEnum,
    slug: string,
): EditMainContent | undefined {
    const anime = useQuery({
        ...contentInfoOptions(ContentTypeEnum.ANIME, slug),
        enabled: contentType === ContentTypeEnum.ANIME,
    });
    const manga = useQuery({
        ...contentInfoOptions(ContentTypeEnum.MANGA, slug),
        enabled: contentType === ContentTypeEnum.MANGA,
    });
    const novel = useQuery({
        ...contentInfoOptions(ContentTypeEnum.NOVEL, slug),
        enabled: contentType === ContentTypeEnum.NOVEL,
    });
    const character = useQuery({
        ...contentInfoOptions(ContentTypeEnum.CHARACTER, slug),
        enabled: contentType === ContentTypeEnum.CHARACTER,
    });
    const person = useQuery({
        ...contentInfoOptions(ContentTypeEnum.PERSON, slug),
        enabled: contentType === ContentTypeEnum.PERSON,
    });

    // Detail endpoints return supersets of EditMainContent; the edit UI reads
    // only the shared subset, so narrow to the shared union.
    switch (contentType) {
        case ContentTypeEnum.ANIME:
            return anime.data as EditMainContent | undefined;
        case ContentTypeEnum.MANGA:
            return manga.data as EditMainContent | undefined;
        case ContentTypeEnum.NOVEL:
            return novel.data as EditMainContent | undefined;
        case ContentTypeEnum.CHARACTER:
            return character.data as EditMainContent | undefined;
        case ContentTypeEnum.PERSON:
            return person.data as EditMainContent | undefined;
    }
}
