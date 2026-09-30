import {
    animeCharactersInfiniteOptions,
    animeStaffInfiniteOptions,
    ContentTypeEnum,
    mangaCharactersInfiniteOptions,
    novelCharactersInfiniteOptions,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

const ANIME_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(animeCharactersInfiniteOptions({ path: { slug } })),
    useStaff: (slug: string, enabled?: boolean) =>
        useInfiniteList(animeStaffInfiniteOptions({ path: { slug } }), {
            enabled,
        }),
};

const MANGA_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(mangaCharactersInfiniteOptions({ path: { slug } })),
};

const NOVEL_CONFIG = {
    useCharacters: (slug: string) =>
        useInfiniteList(novelCharactersInfiniteOptions({ path: { slug } })),
};

export const CONTENT_CONFIG = {
    [ContentTypeEnum.ANIME]: ANIME_CONFIG,
    [ContentTypeEnum.MANGA]: MANGA_CONFIG,
    [ContentTypeEnum.NOVEL]: NOVEL_CONFIG,
};
