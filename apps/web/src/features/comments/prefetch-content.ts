import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchAnimeInfo,
    prefetchArticle,
    prefetchCharacterInfo,
    prefetchCollection,
    prefetchEdit,
    prefetchMangaInfo,
    prefetchNovelInfo,
    prefetchPersonInfo,
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
    const clientConfig = await getHikkaClientConfig();

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return await prefetchAnimeInfo({ slug, clientConfig, ...rest });
        case ContentTypeEnum.MANGA:
            return await prefetchMangaInfo({ slug, clientConfig, ...rest });
        case ContentTypeEnum.NOVEL:
            return await prefetchNovelInfo({ slug, clientConfig, ...rest });
        case ContentTypeEnum.CHARACTER:
            return await prefetchCharacterInfo({ slug, clientConfig, ...rest });
        case ContentTypeEnum.PERSON:
            return await prefetchPersonInfo({ slug, clientConfig, ...rest });
        case ContentTypeEnum.COLLECTION:
            return await prefetchCollection({
                reference: slug,
                clientConfig,
                ...rest,
            });
        case ContentTypeEnum.EDIT:
            return await prefetchEdit({ editId: slug, clientConfig, ...rest });
        case ContentTypeEnum.ARTICLE:
            return await prefetchArticle({ slug, clientConfig, ...rest });
        default:
            return null;
    }
}
