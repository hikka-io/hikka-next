import type { QueryClient } from '@tanstack/react-query';

import {
    animeSlugOptions,
    type Client,
    ContentTypeEnum,
    characterInfoOptions,
    getArticleOptions,
    getCollectionOptions,
    getEditOptions,
    mangaInfoOptions,
    novelInfoOptions,
    personInfoOptions,
    userProfileOptions,
} from '@hikka/api';

import { ensureOr404 } from '@/utils/api/ensure-or-404';

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
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    animeSlugOptions({ path: { slug }, client: apiClient }),
                ),
            );
        case ContentTypeEnum.MANGA:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    mangaInfoOptions({ path: { slug }, client: apiClient }),
                ),
            );
        case ContentTypeEnum.NOVEL:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    novelInfoOptions({ path: { slug }, client: apiClient }),
                ),
            );
        case ContentTypeEnum.CHARACTER:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    characterInfoOptions({ path: { slug }, client: apiClient }),
                ),
            );
        case ContentTypeEnum.PERSON:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    personInfoOptions({ path: { slug }, client: apiClient }),
                ),
            );
        case ContentTypeEnum.COLLECTION:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    getCollectionOptions({
                        path: { reference: slug },
                        client: apiClient,
                    }),
                ),
            );
        case ContentTypeEnum.EDIT:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    getEditOptions({
                        path: { edit_id: Number(slug) },
                        client: apiClient,
                    }),
                ),
            );
        case ContentTypeEnum.ARTICLE:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    getArticleOptions({ path: { slug }, client: apiClient }),
                ),
            );
        case ContentTypeEnum.USER:
            return await ensureOr404(() =>
                queryClient.ensureQueryData(
                    userProfileOptions({
                        path: { username: slug },
                        client: apiClient,
                    }),
                ),
            );
        default:
            return null;
    }
}
