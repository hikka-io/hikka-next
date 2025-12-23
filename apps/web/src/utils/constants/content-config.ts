import { ContentTypeEnum } from '@hikka/client';
import {
    useAnimeBySlug,
    useAnimeCharacters,
    useAnimeStaff,
    useCharacterBySlug,
    useMangaBySlug,
    useMangaCharacters,
    useNovelBySlug,
    useNovelCharacters,
    usePersonBySlug,
    useReadBySlug,
    useWatchBySlug,
} from '@hikka/react';

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
};

type ContentConfig = {
    characters:
        | typeof useAnimeCharacters
        | typeof useMangaCharacters
        | typeof useNovelCharacters;
    useUserlistRecord: typeof useWatchBySlug | typeof useReadBySlug;
    info: typeof useAnimeBySlug | typeof useMangaBySlug | typeof useNovelBySlug;
};

const ANIME_CONFIG = {
    useCharacters: (slug: string) => useAnimeCharacters({ slug }),
    useUserlistRecord: (slug: string) => useWatchBySlug({ slug }),
    useInfo: (slug: string) => useAnimeBySlug({ slug }),
    useStaff: (slug: string) => useAnimeStaff({ slug }),
};

const MANGA_CONFIG = {
    useCharacters: (slug: string) => useMangaCharacters({ slug }),
    useUserlistRecord: (slug: string) =>
        useReadBySlug({ slug, contentType: ContentTypeEnum.MANGA }),
    useInfo: (slug: string) => useMangaBySlug({ slug }),
};

const NOVEL_CONFIG = {
    useCharacters: (slug: string) => useNovelCharacters({ slug }),
    useUserlistRecord: (slug: string) =>
        useReadBySlug({ slug, contentType: ContentTypeEnum.NOVEL }),
    useInfo: (slug: string) => useNovelBySlug({ slug }),
};

const CHARACTER_CONFIG = {
    useInfo: (slug: string) => useCharacterBySlug({ slug }),
};

const PERSON_CONFIG = {
    useInfo: (slug: string) => usePersonBySlug({ slug }),
};

export const CONTENT_CONFIG = {
    [ContentTypeEnum.ANIME]: ANIME_CONFIG,
    [ContentTypeEnum.MANGA]: MANGA_CONFIG,
    [ContentTypeEnum.NOVEL]: NOVEL_CONFIG,
    [ContentTypeEnum.CHARACTER]: CHARACTER_CONFIG,
    [ContentTypeEnum.PERSON]: PERSON_CONFIG,
};

