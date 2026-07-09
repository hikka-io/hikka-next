import { useQuery } from '@tanstack/react-query';

import {
    animeSlugOptions,
    ContentTypeEnum,
    characterInfoOptions,
    type EditContentTypeEnum,
    mangaInfoOptions,
    novelInfoOptions,
    personInfoOptions,
} from '@hikka/api';

import type { EditMainContent } from '../types';

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
        ...animeSlugOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.ANIME,
    });
    const manga = useQuery({
        ...mangaInfoOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.MANGA,
    });
    const novel = useQuery({
        ...novelInfoOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.NOVEL,
    });
    const character = useQuery({
        ...characterInfoOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.CHARACTER,
    });
    const person = useQuery({
        ...personInfoOptions({ path: { slug } }),
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
