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
    ExtraProps extends Record<string, any> = Record<string, any>,
> = Record<
    T,
    {
        title_ua: string;
        title_en: string;
        description?: string;
    } & ExtraProps
>;

export const SEASON: FilterProperty<SeasonEnum> = {
    winter: {
        title_ua: 'Зима',
        title_en: 'Winter',
    },
    spring: {
        title_ua: 'Весна',
        title_en: 'Spring',
    },
    summer: {
        title_ua: 'Літо',
        title_en: 'Summer',
    },
    fall: {
        title_ua: 'Осінь',
        title_en: 'Fall',
    },
};

export const RELEASE_STATUS: FilterProperty<ContentStatusEnum> = {
    [ContentStatusEnum.DISCONTINUED]: {
        title_ua: 'Припинено',
        title_en: 'Discontinued',
    },
    [ContentStatusEnum.ONGOING]: {
        title_ua: 'Онґоїнґ',
        title_en: 'Ongoing',
    },
    [ContentStatusEnum.FINISHED]: {
        title_ua: 'Завершено',
        title_en: 'Finished',
    },
    [ContentStatusEnum.ANNOUNCED]: {
        title_ua: 'Анонс',
        title_en: 'Announced',
    },
    [ContentStatusEnum.PAUSED]: {
        title_ua: 'Призупинено',
        title_en: 'Paused',
    },
};

export const ANIME_MEDIA_TYPE: FilterProperty<AnimeMediaEnum> = {
    [AnimeMediaEnum.SPECIAL]: {
        title_ua: 'Спешл',
        title_en: 'Special',
    },
    [AnimeMediaEnum.MOVIE]: {
        title_ua: 'Фільм',
        title_en: 'Movie',
    },
    [AnimeMediaEnum.OVA]: {
        title_ua: 'OVA',
        title_en: 'OVA',
    },
    [AnimeMediaEnum.ONA]: {
        title_ua: 'ONA',
        title_en: 'ONA',
    },
    [AnimeMediaEnum.TV]: {
        title_ua: 'TV Серіал',
        title_en: 'TV',
    },
    [AnimeMediaEnum.MUSIC]: {
        title_ua: 'Музика',
        title_en: 'Music',
    },
};

export const MANGA_MEDIA_TYPE: FilterProperty<MangaMediaEnum> = {
    [MangaMediaEnum.ONE_SHOT]: {
        title_ua: 'Ваншот',
        title_en: 'One Shot',
    },
    [MangaMediaEnum.DOUJIN]: {
        title_ua: 'Доджінші',
        title_en: 'Doujin',
    },
    [MangaMediaEnum.MANHUA]: {
        title_ua: 'Маньхва',
        title_en: 'Manhua',
    },
    [MangaMediaEnum.MANHWA]: {
        title_ua: 'Манхва',
        title_en: 'Manhwa',
    },
    [MangaMediaEnum.MANGA]: {
        title_ua: 'Манґа',
        title_en: 'Manga',
    },
};

export const NOVEL_MEDIA_TYPE: FilterProperty<NovelMediaEnum> = {
    [NovelMediaEnum.LIGHT_NOVEL]: {
        title_ua: 'Ранобе',
        title_en: 'Light Novel',
    },
    [NovelMediaEnum.NOVEL]: {
        title_ua: 'Вебновела',
        title_en: 'Novel',
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
        title_en: 'G',
        description: 'Немає вікових обмежень',
    },
    [AnimeAgeRatingEnum.PG]: {
        title_ua: 'PG',
        title_en: 'PG',
        description: 'Рекомендується присутність батьків',
    },
    [AnimeAgeRatingEnum.PG_13]: {
        title_ua: 'PG-13',
        title_en: 'PG-13',
        description: 'Дітям до 13 років перегляд небажаний',
    },
    [AnimeAgeRatingEnum.R]: {
        title_ua: 'R',
        title_en: 'R',
        description: 'Особам до 18 років обовʼязкова присутність дорослого',
    },
    [AnimeAgeRatingEnum.R_PLUS]: {
        title_ua: 'R PLUS',
        title_en: 'R PLUS',
        description: 'Особам до 18 років перегляд заборонений',
    },
    [AnimeAgeRatingEnum.RX]: {
        title_ua: 'RX',
        title_en: 'RX',
        description: 'Хентай',
    },
};

export const VIDEO: FilterProperty<AnimeVideoTypeEnum> = {
    [AnimeVideoTypeEnum.VIDEO_PROMO]: {
        title_ua: 'Промо-відео',
        title_en: 'Promo Video',
    },
    [AnimeVideoTypeEnum.VIDEO_MUSIC]: {
        title_ua: 'Музичне Відео',
        title_en: 'Music Video',
    },
};

export const OST: FilterProperty<AnimeOstTypeEnum> = {
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
        title_en: 'Theme',
    },
    [GenreTypeEnum.EXPLICIT]: {
        title_ua: 'Для дорослих',
        title_en: 'Explicit',
    },
    [GenreTypeEnum.GENRE]: {
        title_ua: 'Основне',
        title_en: 'General',
    },
    [GenreTypeEnum.DEMOGRAPHIC]: {
        title_ua: 'Демографічне',
        title_en: 'Demographic',
    },
};

export const READ_STATUS: FilterProperty<ReadStatusEnum> = {
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

export const WATCH_STATUS: FilterProperty<WatchStatusEnum> = {
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
        title_en: 'News',
    },
    [ArticleCategoryEnum.SYSTEM]: {
        title_ua: 'Системне',
        title_en: 'System',
        admin: true,
    },
    [ArticleCategoryEnum.REVIEWS]: {
        title_ua: 'Огляди',
        title_en: 'Reviews',
    },
    [ArticleCategoryEnum.ORIGINAL]: {
        title_ua: 'Авторське',
        title_en: 'Original',
    },
};

export const CONTENT_ISSUES: FilterProperty<string> = {
    title_ua: { title_ua: 'Назва (укр)', title_en: 'Title (ua)' },
    title_en: { title_ua: 'Назва (англ)', title_en: 'Title (en)' },
    title_original: { title_ua: 'Назва (ориг)', title_en: 'Title (original)' },
    synopsis_ua: { title_ua: 'Опис (укр)', title_en: 'Synopsis (ua)' },
    synopsis_en: { title_ua: 'Опис (англ)', title_en: 'Synopsis (en)' },
};

export const PERSON_ISSUES: FilterProperty<string> = {
    name_ua: { title_ua: "Ім'я (укр)", title_en: 'Name (ua)' },
    name_en: { title_ua: "Ім'я (англ)", title_en: 'Name (en)' },
    name_original: { title_ua: "Ім'я (ориг)", title_en: 'Name (original)' },
};

export const CHARACTER_ISSUES: FilterProperty<string> = {
    ...PERSON_ISSUES,
    description_ua: { title_ua: 'Опис (укр)', title_en: 'Description (ua)' },
};

export const EDIT_STATUS: FilterProperty<EditStatusEnum> = {
    pending: {
        title_ua: 'На Розгляді',
        title_en: 'Pending',
    },
    accepted: {
        title_ua: 'Прийнято',
        title_en: 'Accepted',
    },
    denied: {
        title_ua: 'Відхилено',
        title_en: 'Denied',
    },
    closed: {
        title_ua: 'Закрито',
        title_en: 'Closed',
    },
};
