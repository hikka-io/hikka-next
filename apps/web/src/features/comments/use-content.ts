import {
    CommentsContentType,
    ContentTypeEnum,
    EditContentType,
} from '@hikka/client';
import {
    useAnimeBySlug,
    useArticleBySlug,
    useCharacterBySlug,
    useCollectionByReference,
    useEdit,
    useMangaBySlug,
    useNovelBySlug,
    usePersonBySlug,
} from '@hikka/react';

import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/adapters/convert-title';

interface UseContentParams {
    content_type: CommentsContentType | EditContentType;
    slug: string;
}

export function useContent({ content_type, slug }: UseContentParams) {
    const { titleLanguage } = useSettingsContext();

    const animeQuery = useAnimeBySlug({
        slug: slug,
        options: {
            enabled: content_type === ContentTypeEnum.ANIME,
            select: (data) => ({
                content_type: ContentTypeEnum.ANIME,
                title: convertTitle({
                    data: data as any,
                    titleLanguage: titleLanguage!,
                }).title,
                image: data.image,
            }),
        },
    });

    const mangaQuery = useMangaBySlug({
        slug: slug,
        options: {
            enabled: content_type === ContentTypeEnum.MANGA,
            select: (data) => ({
                content_type: ContentTypeEnum.MANGA,
                title: convertTitle({
                    data: data as any,
                    titleLanguage: titleLanguage!,
                }).title,
                image: data.image,
            }),
        },
    });

    const novelQuery = useNovelBySlug({
        slug: slug,
        options: {
            enabled: content_type === ContentTypeEnum.NOVEL,
            select: (data) => ({
                content_type: ContentTypeEnum.NOVEL,
                title: convertTitle({
                    data: data as any,
                    titleLanguage: titleLanguage!,
                }).title,
                image: data.image,
            }),
        },
    });

    const characterQuery = useCharacterBySlug({
        slug: slug,
        options: {
            enabled: content_type === ContentTypeEnum.CHARACTER,
            select: (data) => ({
                content_type: ContentTypeEnum.CHARACTER,
                title: data.title,
                image: data.image,
            }),
        },
    });

    const personQuery = usePersonBySlug({
        slug: slug,
        options: {
            enabled: content_type === ContentTypeEnum.PERSON,
            select: (data) => ({
                content_type: ContentTypeEnum.PERSON,
                title: data.title,
                image: data.image,
            }),
        },
    });

    const collectionQuery = useCollectionByReference({
        reference: slug,
        options: {
            enabled: content_type === ContentTypeEnum.COLLECTION,
            select: (data) => ({
                content_type: ContentTypeEnum.COLLECTION,
                title: data.title,
                image:
                    data.collection[0].content.data_type ===
                    ContentTypeEnum.ANIME
                        ? data.collection[0].content.image
                        : data.collection[0].content.image,
            }),
        },
    });

    const editQuery = useEdit({
        editId: slug,
        options: {
            enabled: content_type === ContentTypeEnum.EDIT,
            select: (data) => ({
                content_type: ContentTypeEnum.EDIT,
                title: `Правка #${data.edit_id}`,
                image:
                    data.content.data_type === 'anime'
                        ? data.content.image
                        : data.content.image,
            }),
        },
    });

    const articleQuery = useArticleBySlug({
        slug: slug,
        options: {
            enabled: content_type === ContentTypeEnum.ARTICLE,
            select: (data) => ({
                title: data.title,
                content_type: ContentTypeEnum.ARTICLE,
                image: null,
            }),
        },
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
