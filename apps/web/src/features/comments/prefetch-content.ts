import { ContentTypeEnum } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    PrefetchQueryParams,
    prefetchAnimeBySlug,
    prefetchArticleBySlug,
    prefetchCharacterBySlug,
    prefetchCollectionByReference,
    prefetchEdit,
    prefetchMangaBySlug,
    prefetchNovelBySlug,
    prefetchPersonBySlug,
} from '@hikka/react/server';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface UseContentParams {
    slug: string;
    content_type: ContentTypeEnum;
    queryClient: QueryClient;
}

export async function prefetchContent({
    slug,
    content_type,
    queryClient,
    ...rest
}: UseContentParams & PrefetchQueryParams<any>) {
    const clientConfig = await getHikkaClientConfig();

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return await prefetchAnimeBySlug({
                slug,
                clientConfig,
                queryClient,
                ...rest,
            });
        case ContentTypeEnum.MANGA:
            return await prefetchMangaBySlug({
                slug,
                clientConfig,
                queryClient,
                ...rest,
            });
        case ContentTypeEnum.NOVEL:
            return await prefetchNovelBySlug({
                slug,
                clientConfig,
                queryClient,
                ...rest,
            });
        case ContentTypeEnum.CHARACTER:
            return await prefetchCharacterBySlug({
                slug,
                clientConfig,
                ...rest,
            });
        case ContentTypeEnum.PERSON:
            return await prefetchPersonBySlug({
                slug,
                clientConfig,
                queryClient,
                ...rest,
            });
        case ContentTypeEnum.COLLECTION:
            return await prefetchCollectionByReference({
                reference: slug,
                clientConfig,
                queryClient,
                ...rest,
            });
        case ContentTypeEnum.EDIT:
            return await prefetchEdit({
                editId: slug,
                clientConfig,
                queryClient,
                ...rest,
            });
        case ContentTypeEnum.ARTICLE:
            return await prefetchArticleBySlug({
                slug,
                clientConfig,
                queryClient,
                ...rest,
            });
        default:
            return null;
    }
}
