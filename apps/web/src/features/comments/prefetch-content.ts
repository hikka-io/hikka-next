import { ContentTypeEnum } from '@hikka/client';
import {
    getQueryClient,
    prefetchAnimeInfo,
    prefetchArticle,
    prefetchCharacterInfo,
    prefetchCollection,
    prefetchEdit,
    prefetchMangaInfo,
    prefetchNovelInfo,
    prefetchPersonInfo,
    queryKeys,
} from '@hikka/react';
import { PrefetchQueryParams } from '@hikka/react/server/prefetchQuery';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface UseContentParams {
    slug: string;
    content_type: ContentTypeEnum;
}

export async function prefetchContent({
    slug,
    content_type,
    ...rest
}: UseContentParams & PrefetchQueryParams<any>) {
    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            await prefetchAnimeInfo({ slug, clientConfig, ...rest });
            return queryClient.getQueryData(queryKeys.anime.details(slug));
        case ContentTypeEnum.MANGA:
            await prefetchMangaInfo({ slug, clientConfig, ...rest });
            return queryClient.getQueryData(queryKeys.manga.details(slug));
        case ContentTypeEnum.NOVEL:
            await prefetchNovelInfo({ slug, clientConfig, ...rest });
            return queryClient.getQueryData(queryKeys.novel.details(slug));
        case ContentTypeEnum.CHARACTER:
            await prefetchCharacterInfo({ slug, clientConfig, ...rest });
            return queryClient.getQueryData(queryKeys.characters.bySlug(slug));
        case ContentTypeEnum.PERSON:
            await prefetchPersonInfo({ slug, clientConfig, ...rest });
            return queryClient.getQueryData(queryKeys.people.bySlug(slug));
        case ContentTypeEnum.COLLECTION:
            await prefetchCollection({
                reference: slug,
                clientConfig,
                ...rest,
            });
            return queryClient.getQueryData(
                queryKeys.collections.byReference(slug),
            );
        case ContentTypeEnum.EDIT:
            await prefetchEdit({ editId: slug, clientConfig, ...rest });
            return queryClient.getQueryData(queryKeys.edit.byId(slug));
        case ContentTypeEnum.ARTICLE:
            await prefetchArticle({ slug, clientConfig, ...rest });
            return queryClient.getQueryData(queryKeys.articles.bySlug(slug));
        default:
            return null;
    }
}
