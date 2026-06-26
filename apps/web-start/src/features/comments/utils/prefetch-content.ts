import type { QueryClient } from '@tanstack/react-query';

import {
    animeSlugOptions,
    characterInfoOptions,
    type Client,
    ContentTypeEnum,
    getArticleOptions,
    getCollectionOptions,
    getEditOptions,
    mangaInfoOptions,
    novelInfoOptions,
    personInfoOptions,
} from '@hikka/api';

interface PrefetchContentParams {
    slug: string;
    content_type: ContentTypeEnum;
    queryClient: QueryClient;
    apiClient: Client;
}

export default async function prefetchContent({
    slug,
    content_type,
    queryClient,
    apiClient,
}: PrefetchContentParams) {
    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return await queryClient.ensureQueryData(
                animeSlugOptions({ path: { slug }, client: apiClient }),
            );
        case ContentTypeEnum.MANGA:
            return await queryClient.ensureQueryData(
                mangaInfoOptions({ path: { slug }, client: apiClient }),
            );
        case ContentTypeEnum.NOVEL:
            return await queryClient.ensureQueryData(
                novelInfoOptions({ path: { slug }, client: apiClient }),
            );
        case ContentTypeEnum.CHARACTER:
            return await queryClient.ensureQueryData(
                characterInfoOptions({ path: { slug }, client: apiClient }),
            );
        case ContentTypeEnum.PERSON:
            return await queryClient.ensureQueryData(
                personInfoOptions({ path: { slug }, client: apiClient }),
            );
        case ContentTypeEnum.COLLECTION:
            return await queryClient.ensureQueryData(
                getCollectionOptions({
                    path: { reference: slug },
                    client: apiClient,
                }),
            );
        case ContentTypeEnum.EDIT:
            return await queryClient.ensureQueryData(
                getEditOptions({
                    path: { edit_id: Number(slug) },
                    client: apiClient,
                }),
            );
        case ContentTypeEnum.ARTICLE:
            return await queryClient.ensureQueryData(
                getArticleOptions({ path: { slug }, client: apiClient }),
            );
        default:
            return null;
    }
}
