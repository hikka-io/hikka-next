import {
    animeCharactersInfiniteOptions,
    animeSlugOptions,
    animeStaffInfiniteOptions,
    characterInfoOptions,
    ContentTypeEnum,
    mangaCharactersInfiniteOptions,
    mangaInfoOptions,
    novelCharactersInfiniteOptions,
    novelInfoOptions,
    personInfoOptions,
    ReadContentTypeEnum,
    readGetOptions,
    watchGetOptions,
} from '@hikka/api';
import { useQuery } from '@tanstack/react-query';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

export const CONTENT_TYPES: Hikka.FilterProperty<ContentTypeEnum | 'user'> = {
    [ContentTypeEnum.ANIME]: {
        title_ua: 'Аніме',
        title_en: 'Anime',
    },
    [ContentTypeEnum.CHARACTER]: {
        title_ua: 'Персонаж',
        title_en: 'Character',
    },
    [ContentTypeEnum.PERSON]: {
        title_ua: 'Автор',
        title_en: 'Person',
    },
    [ContentTypeEnum.EDIT]: {
        title_ua: 'Правка',
        title_en: 'Edit',
    },
    [ContentTypeEnum.COMMENT]: {
        title_ua: 'Коментар',
        title_en: 'Comment',
    },
    [ContentTypeEnum.COLLECTION]: {
        title_ua: 'Колекція',
        title_en: 'Collection',
    },
    [ContentTypeEnum.MANGA]: {
        title_ua: 'Манґа',
        title_en: 'Manga',
    },
    [ContentTypeEnum.NOVEL]: {
        title_ua: 'Ранобе',
        title_en: 'Ranobe',
    },
    [ContentTypeEnum.USER]: {
        title_ua: 'Користувач',
        title_en: 'User',
    },
    [ContentTypeEnum.ARTICLE]: {
        title_ua: 'Стаття',
        title_en: 'Article',
    },
    [ContentTypeEnum.HISTORY]: {
        title_ua: 'Активність',
        title_en: 'History',
    },
};

const ANIME_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(animeCharactersInfiniteOptions({ path: { slug } })),
    useUserlistRecord: (slug: string) =>
        useQuery(watchGetOptions({ path: { slug } })),
    useInfo: (slug: string) => useQuery(animeSlugOptions({ path: { slug } })),
    useStaff: (slug: string) =>
        useInfiniteList(animeStaffInfiniteOptions({ path: { slug } })),
};

const MANGA_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(mangaCharactersInfiniteOptions({ path: { slug } })),
    useUserlistRecord: (slug: string) =>
        useQuery(
            readGetOptions({
                path: { slug, content_type: ReadContentTypeEnum.MANGA },
            }),
        ),
    useInfo: (slug: string) => useQuery(mangaInfoOptions({ path: { slug } })),
};

const NOVEL_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(novelCharactersInfiniteOptions({ path: { slug } })),
    useUserlistRecord: (slug: string) =>
        useQuery(
            readGetOptions({
                path: { slug, content_type: ReadContentTypeEnum.NOVEL },
            }),
        ),
    useInfo: (slug: string) => useQuery(novelInfoOptions({ path: { slug } })),
};

const CHARACTER_CONFIG = {
    useInfo: (slug: string) =>
        useQuery(characterInfoOptions({ path: { slug } })),
};

const PERSON_CONFIG = {
    useInfo: (slug: string) => useQuery(personInfoOptions({ path: { slug } })),
};

export const CONTENT_CONFIG = {
    [ContentTypeEnum.ANIME]: ANIME_CONFIG,
    [ContentTypeEnum.MANGA]: MANGA_CONFIG,
    [ContentTypeEnum.NOVEL]: NOVEL_CONFIG,
    [ContentTypeEnum.CHARACTER]: CHARACTER_CONFIG,
    [ContentTypeEnum.PERSON]: PERSON_CONFIG,
};
