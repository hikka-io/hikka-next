import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeOstTypeEnum,
    AnimeVideoTypeEnum,
    ArticleCategoryEnum,
    ContentStatusEnum,
    ContentTypeEnum,
    type EditStatusEnum,
    GenreTypeEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    ReadStatusEnum,
    type SeasonEnum,
    WatchStatusEnum,
} from '@hikka/api';

export type FilterProperty<
    T extends string,
    ExtraProps extends Record<string, any> = Record<never, never>,
> = Record<
    T,
    {
        title_ua: string;
        description?: string;
    } & ExtraProps
>;

type EnglishTitle = { title_en: string };

export const SEASON: FilterProperty<SeasonEnum> = {
    winter: {
        title_ua: 'Зима',
    },
    spring: {
        title_ua: 'Весна',
    },
    summer: {
        title_ua: 'Літо',
    },
    fall: {
        title_ua: 'Осінь',
    },
};

export const RELEASE_STATUS: FilterProperty<ContentStatusEnum> = {
    [ContentStatusEnum.DISCONTINUED]: {
        title_ua: 'Припинено',
    },
    [ContentStatusEnum.ONGOING]: {
        title_ua: 'Онґоїнґ',
    },
    [ContentStatusEnum.FINISHED]: {
        title_ua: 'Завершено',
    },
    [ContentStatusEnum.ANNOUNCED]: {
        title_ua: 'Анонс',
    },
    [ContentStatusEnum.PAUSED]: {
        title_ua: 'Призупинено',
    },
};

export const ANIME_MEDIA_TYPE: FilterProperty<AnimeMediaEnum> = {
    [AnimeMediaEnum.SPECIAL]: {
        title_ua: 'Спешл',
    },
    [AnimeMediaEnum.MOVIE]: {
        title_ua: 'Фільм',
    },
    [AnimeMediaEnum.OVA]: {
        title_ua: 'OVA',
    },
    [AnimeMediaEnum.ONA]: {
        title_ua: 'ONA',
    },
    [AnimeMediaEnum.TV]: {
        title_ua: 'TV Серіал',
    },
    [AnimeMediaEnum.MUSIC]: {
        title_ua: 'Музика',
    },
};

export const MANGA_MEDIA_TYPE: FilterProperty<MangaMediaEnum> = {
    [MangaMediaEnum.ONE_SHOT]: {
        title_ua: 'Ваншот',
    },
    [MangaMediaEnum.DOUJIN]: {
        title_ua: 'Доджінші',
    },
    [MangaMediaEnum.MANHUA]: {
        title_ua: 'Маньхва',
    },
    [MangaMediaEnum.MANHWA]: {
        title_ua: 'Манхва',
    },
    [MangaMediaEnum.MANGA]: {
        title_ua: 'Манґа',
    },
};

export const NOVEL_MEDIA_TYPE: FilterProperty<NovelMediaEnum> = {
    [NovelMediaEnum.LIGHT_NOVEL]: {
        title_ua: 'Ранобе',
    },
    [NovelMediaEnum.NOVEL]: {
        title_ua: 'Вебновела',
    },
};

export const MEDIA_TYPE: FilterProperty<
    NovelMediaEnum | MangaMediaEnum | AnimeMediaEnum
> = {
    ...ANIME_MEDIA_TYPE,
    ...MANGA_MEDIA_TYPE,
    ...NOVEL_MEDIA_TYPE,
};

export const MEDIA_TYPE_BY_CONTENT_TYPE: Partial<
    Record<ContentTypeEnum, FilterProperty<string>>
> = {
    [ContentTypeEnum.ANIME]: ANIME_MEDIA_TYPE,
    [ContentTypeEnum.MANGA]: MANGA_MEDIA_TYPE,
    [ContentTypeEnum.NOVEL]: NOVEL_MEDIA_TYPE,
};

const isMediaType = (
    mediaType?: string | null,
): mediaType is keyof typeof MEDIA_TYPE =>
    mediaType != null && Object.hasOwn(MEDIA_TYPE, mediaType);

export function getMediaTypeLabel(
    mediaType?: string | null,
): string | undefined {
    return isMediaType(mediaType) ? MEDIA_TYPE[mediaType].title_ua : undefined;
}

export const AGE_RATING: FilterProperty<AnimeAgeRatingEnum> = {
    [AnimeAgeRatingEnum.G]: {
        title_ua: 'G',
        description: 'Немає вікових обмежень',
    },
    [AnimeAgeRatingEnum.PG]: {
        title_ua: 'PG',
        description: 'Рекомендується присутність батьків',
    },
    [AnimeAgeRatingEnum.PG_13]: {
        title_ua: 'PG-13',
        description: 'Дітям до 13 років перегляд небажаний',
    },
    [AnimeAgeRatingEnum.R]: {
        title_ua: 'R',
        description: 'Особам до 18 років обовʼязкова присутність дорослого',
    },
    [AnimeAgeRatingEnum.R_PLUS]: {
        title_ua: 'R PLUS',
        description: 'Особам до 18 років перегляд заборонений',
    },
    [AnimeAgeRatingEnum.RX]: {
        title_ua: 'RX',
        description: 'Хентай',
    },
};

export const VIDEO: FilterProperty<AnimeVideoTypeEnum, EnglishTitle> = {
    [AnimeVideoTypeEnum.VIDEO_PROMO]: {
        title_ua: 'Промо-відео',
        title_en: 'Promo Video',
    },
    [AnimeVideoTypeEnum.VIDEO_MUSIC]: {
        title_ua: 'Музичне Відео',
        title_en: 'Music Video',
    },
};

export const OST: FilterProperty<AnimeOstTypeEnum, EnglishTitle> = {
    [AnimeOstTypeEnum.OPENING]: {
        title_ua: 'Опенінґ',
        title_en: 'Opening',
    },
    [AnimeOstTypeEnum.ENDING]: {
        title_ua: 'Ендінґ',
        title_en: 'Ending',
    },
};

export const GENRE_TYPES: FilterProperty<GenreTypeEnum> = {
    [GenreTypeEnum.THEME]: {
        title_ua: 'Тематичне',
    },
    [GenreTypeEnum.EXPLICIT]: {
        title_ua: 'Для дорослих',
    },
    [GenreTypeEnum.GENRE]: {
        title_ua: 'Основне',
    },
    [GenreTypeEnum.DEMOGRAPHIC]: {
        title_ua: 'Демографічне',
    },
};

export const READ_STATUS: FilterProperty<ReadStatusEnum, EnglishTitle> = {
    [ReadStatusEnum.PLANNED]: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
    },
    [ReadStatusEnum.COMPLETED]: {
        title_ua: 'Завершено',
        title_en: 'Completed',
    },
    [ReadStatusEnum.ON_HOLD]: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
    },
    [ReadStatusEnum.DROPPED]: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
    },
    [ReadStatusEnum.READING]: {
        title_ua: 'Читаю',
        title_en: 'Reading',
    },
};

export const WATCH_STATUS: FilterProperty<WatchStatusEnum, EnglishTitle> = {
    [WatchStatusEnum.PLANNED]: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
    },
    [WatchStatusEnum.WATCHING]: {
        title_ua: 'Дивлюсь',
        title_en: 'Watching',
    },
    [WatchStatusEnum.COMPLETED]: {
        title_ua: 'Завершено',
        title_en: 'Completed',
    },
    [WatchStatusEnum.ON_HOLD]: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
    },
    [WatchStatusEnum.DROPPED]: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
    },
};

export const LIST_STATUS = {
    watch: WATCH_STATUS,
    read: READ_STATUS,
} as const;

export const ARTICLE_CATEGORY: FilterProperty<
    ArticleCategoryEnum,
    { admin?: boolean }
> = {
    [ArticleCategoryEnum.NEWS]: {
        title_ua: 'Новини',
    },
    [ArticleCategoryEnum.SYSTEM]: {
        title_ua: 'Системне',
        admin: true,
    },
    [ArticleCategoryEnum.REVIEWS]: {
        title_ua: 'Огляди',
    },
    [ArticleCategoryEnum.ORIGINAL]: {
        title_ua: 'Авторське',
    },
};

export const CONTENT_ISSUES: FilterProperty<string> = {
    title_ua: { title_ua: 'Назва (укр)' },
    title_en: { title_ua: 'Назва (англ)' },
    title_original: { title_ua: 'Назва (ориг)' },
    synopsis_ua: { title_ua: 'Опис (укр)' },
    synopsis_en: { title_ua: 'Опис (англ)' },
};

export const PERSON_ISSUES: FilterProperty<string> = {
    name_ua: { title_ua: "Ім'я (укр)" },
    name_en: { title_ua: "Ім'я (англ)" },
    name_original: { title_ua: "Ім'я (ориг)" },
};

export const CHARACTER_ISSUES: FilterProperty<string> = {
    ...PERSON_ISSUES,
    description_ua: { title_ua: 'Опис (укр)' },
};

export const EDIT_STATUS: FilterProperty<EditStatusEnum> = {
    pending: {
        title_ua: 'На Розгляді',
    },
    accepted: {
        title_ua: 'Прийнято',
    },
    denied: {
        title_ua: 'Відхилено',
    },
    closed: {
        title_ua: 'Закрито',
    },
};
