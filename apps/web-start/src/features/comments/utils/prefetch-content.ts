import { ContentTypeEnum, HikkaClient } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    animeBySlugOptions,
    articleBySlugOptions,
    characterBySlugOptions,
    collectionByReferenceOptions,
    editOptions,
    mangaBySlugOptions,
    novelBySlugOptions,
    personBySlugOptions,
} from '@hikka/react/options';

interface PrefetchContentParams {
    slug: string;
    content_type: ContentTypeEnum;
    queryClient: QueryClient;
    hikkaClient: HikkaClient;
}

export default async function prefetchContent({
    slug,
    content_type,
    queryClient,
    hikkaClient,
}: PrefetchContentParams) {
    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return await queryClient.ensureQueryData(
                animeBySlugOptions(hikkaClient, { slug }),
            );
        case ContentTypeEnum.MANGA:
            return await queryClient.ensureQueryData(
                mangaBySlugOptions(hikkaClient, { slug }),
            );
        case ContentTypeEnum.NOVEL:
            return await queryClient.ensureQueryData(
                novelBySlugOptions(hikkaClient, { slug }),
            );
        case ContentTypeEnum.CHARACTER:
            return await queryClient.ensureQueryData(
                characterBySlugOptions(hikkaClient, { slug }),
            );
        case ContentTypeEnum.PERSON:
            return await queryClient.ensureQueryData(
                personBySlugOptions(hikkaClient, { slug }),
            );
        case ContentTypeEnum.COLLECTION:
            return await queryClient.ensureQueryData(
                collectionByReferenceOptions(hikkaClient, {
                    reference: slug,
                }),
            );
        case ContentTypeEnum.EDIT:
            return await queryClient.ensureQueryData(
                editOptions(hikkaClient, { editId: slug }),
            );
        case ContentTypeEnum.ARTICLE:
            return await queryClient.ensureQueryData(
                articleBySlugOptions(hikkaClient, { slug }),
            );
        default:
            return null;
    }
}
