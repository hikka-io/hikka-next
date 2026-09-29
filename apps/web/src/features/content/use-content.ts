import { useQuery } from '@tanstack/react-query';

import {
    type CommentContentTypeEnum as CommentsContentType,
    ContentTypeEnum,
    type EditContentTypeEnum as EditContentType,
} from '@hikka/api';

import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { getContentTitle } from '@/utils/title/get-content-title';

interface UseContentParams {
    content_type:
        | CommentsContentType
        | EditContentType
        | typeof ContentTypeEnum.USER;
    slug: string;
}

export function useContent({ content_type, slug }: UseContentParams) {
    const { preferences } = useSessionUI();
    const titleLang = preferences.title_language;
    const nameLang = preferences.name_language;

    const animeQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.ANIME, slug),
        enabled: content_type === ContentTypeEnum.ANIME,
        select: (data) => ({
            content_type: ContentTypeEnum.ANIME,
            title: getContentTitle(content_type, data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const mangaQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.MANGA, slug),
        enabled: content_type === ContentTypeEnum.MANGA,
        select: (data) => ({
            content_type: ContentTypeEnum.MANGA,
            title: getContentTitle(content_type, data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const novelQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.NOVEL, slug),
        enabled: content_type === ContentTypeEnum.NOVEL,
        select: (data) => ({
            content_type: ContentTypeEnum.NOVEL,
            title: getContentTitle(content_type, data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const characterQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.CHARACTER, slug),
        enabled: content_type === ContentTypeEnum.CHARACTER,
        select: (data) => ({
            content_type: ContentTypeEnum.CHARACTER,
            title: getContentTitle(content_type, data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const personQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.PERSON, slug),
        enabled: content_type === ContentTypeEnum.PERSON,
        select: (data) => ({
            content_type: ContentTypeEnum.PERSON,
            title: getContentTitle(content_type, data, titleLang, nameLang),
            image: data.image,
        }),
    });

    const collectionQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.COLLECTION, slug),
        enabled: content_type === ContentTypeEnum.COLLECTION,
        select: (data) => ({
            content_type: ContentTypeEnum.COLLECTION,
            title: getContentTitle(content_type, data),
            image: data.collection[0].content.image,
        }),
    });

    const editQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.EDIT, slug),
        enabled: content_type === ContentTypeEnum.EDIT,
        select: (data) => ({
            content_type: ContentTypeEnum.EDIT,
            title: getContentTitle(content_type, data),
            image: data.content.image,
        }),
    });

    const articleQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.ARTICLE, slug),
        enabled: content_type === ContentTypeEnum.ARTICLE,
        select: (data) => ({
            title: getContentTitle(content_type, data),
            content_type: ContentTypeEnum.ARTICLE,
            image: null,
        }),
    });

    const userQuery = useQuery({
        ...contentInfoOptions(ContentTypeEnum.USER, slug),
        enabled: content_type === ContentTypeEnum.USER,
        select: (data) => ({
            content_type: ContentTypeEnum.USER,
            title: getContentTitle(content_type, data),
            image: data.avatar,
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
        [ContentTypeEnum.USER]: userQuery,
    };

    return queries[content_type];
}
