import { useQuery } from '@tanstack/react-query';

import {
    animeCharactersInfiniteOptions,
    animeSlugOptions,
    animeStaffInfiniteOptions,
    ContentTypeEnum,
    characterInfoOptions,
    mangaCharactersInfiniteOptions,
    mangaInfoOptions,
    novelCharactersInfiniteOptions,
    novelInfoOptions,
    personInfoOptions,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

const ANIME_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(animeCharactersInfiniteOptions({ path: { slug } })),
    useInfo: (slug: string) => useQuery(animeSlugOptions({ path: { slug } })),
    useStaff: (slug: string) =>
        useInfiniteList(animeStaffInfiniteOptions({ path: { slug } })),
};

const MANGA_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(mangaCharactersInfiniteOptions({ path: { slug } })),
    useInfo: (slug: string) => useQuery(mangaInfoOptions({ path: { slug } })),
};

const NOVEL_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(novelCharactersInfiniteOptions({ path: { slug } })),
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
