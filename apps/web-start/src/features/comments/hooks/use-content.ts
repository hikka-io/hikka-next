import { useQuery } from '@tanstack/react-query';

import {
    animeSlugOptions,
    type AppCommentsSchemasContentTypeEnum as CommentsContentType,
    ContentTypeEnum,
    characterInfoOptions,
    type EditContentTypeEnum as EditContentType,
    getArticleOptions,
    getCollectionOptions,
    getEditOptions,
    mangaInfoOptions,
    novelInfoOptions,
    personInfoOptions,
} from '@hikka/api';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { getTitle } from '@/utils/title/get-title';

interface UseContentParams {
    content_type: CommentsContentType | EditContentType;
    slug: string;
}

export function useContent({ content_type, slug }: UseContentParams) {
    const { preferences } = useSessionUI();
    const titleLang = preferences.title_language;
    const nameLang = preferences.name_language;

    const animeQuery = useQuery({
        ...animeSlugOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.ANIME,
        select: (data) => ({
            content_type: ContentTypeEnum.ANIME,
            title: getTitle(data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const mangaQuery = useQuery({
        ...mangaInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.MANGA,
        select: (data) => ({
            content_type: ContentTypeEnum.MANGA,
            title: getTitle(data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const novelQuery = useQuery({
        ...novelInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.NOVEL,
        select: (data) => ({
            content_type: ContentTypeEnum.NOVEL,
            title: getTitle(data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const characterQuery = useQuery({
        ...characterInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.CHARACTER,
        select: (data) => ({
            content_type: ContentTypeEnum.CHARACTER,
            title: getTitle(data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const personQuery = useQuery({
        ...personInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.PERSON,
        select: (data) => ({
            content_type: ContentTypeEnum.PERSON,
            title: getTitle(data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const collectionQuery = useQuery({
        ...getCollectionOptions({ path: { reference: slug } }),
        enabled: content_type === ContentTypeEnum.COLLECTION,
        select: (data) => ({
            content_type: ContentTypeEnum.COLLECTION,
            title: data.title,
            image: data.collection[0].content.image,
        }),
    });

    const editQuery = useQuery({
        ...getEditOptions({ path: { edit_id: Number(slug) } }),
        enabled: content_type === ContentTypeEnum.EDIT,
        select: (data) => ({
            content_type: ContentTypeEnum.EDIT,
            title: `Правка #${data.edit_id}`,
            image: data.content.image,
        }),
    });

    const articleQuery = useQuery({
        ...getArticleOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.ARTICLE,
        select: (data) => ({
            title: data.title,
            content_type: ContentTypeEnum.ARTICLE,
            image: null,
        }),
    });

    const queries = {
        [ContentTypeEnum.ANIME]: animeQuery,
        [ContentTypeEnum.MANGA]: mangaQuery,
        [ContentTypeEnum.NOVEL]: novelQuery,
        [ContentTypeEnum.CHARACTER]: characterQuery,
        [ContentTypeEnum.PERSON]: personQuery,
        [ContentTypeEnum.COLLECTION]: collectionQuery,
        [ContentTypeEnum.EDIT]: editQuery,
        [ContentTypeEnum.ARTICLE]: articleQuery,
    };

    return queries[content_type];
}
