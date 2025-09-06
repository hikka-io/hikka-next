import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeOSTTypeEnum,
    AnimeVideoTypeEnum,
    ArticleCategoryEnum,
    ContentStatusEnum,
    ContentTypeEnum,
    GenreTypeEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    ReadStatusEnum,
    SeasonEnum,
    SourceEnum,
    WatchStatusEnum,
} from '@hikka/client';
import {
    useAnimeBySlug,
    useAnimeCharacters,
    useAnimeStaff,
    useMangaBySlug,
    useMangaCharacters,
    useNovelBySlug,
    useNovelCharacters,
    useReadBySlug,
    useWatchBySlug,
} from '@hikka/react';

import MaterialSymbolsBookmarkFlagOutlineRounded from '../../components/icons/material-symbols/MaterialSymbolsBookmarkFlagOutlineRounded';
import MaterialSymbolsBookmarkOutline from '../../components/icons/material-symbols/MaterialSymbolsBookmarkOutline';
import MaterialSymbolsNewsmodeRounded from '../../components/icons/material-symbols/MaterialSymbolsNewsmodeRounded';
import MaterialSymbolsReviewsRounded from '../../components/icons/material-symbols/MaterialSymbolsReviewsRounded';
import MaterialSymbolsStarsRounded from '../../components/icons/material-symbols/MaterialSymbolsStarsRounded';
import Completed from '../../components/icons/watch-status/completed';
import Dropped from '../../components/icons/watch-status/dropped';
import OnHold from '../../components/icons/watch-status/on-hold';
import Planned from '../../components/icons/watch-status/planned';
import Watching from '../../components/icons/watch-status/watching';

export const SEASON: Hikka.FilterProperty<SeasonEnum> = {
    winter: {
        title_ua: 'Зима',
        title_en: 'Winter',
        params: {
            months: [1, 2, 3],
        },
    },
    spring: {
        title_ua: 'Весна',
        title_en: 'Spring',
        params: {
            months: [4, 5, 6],
        },
    },
    summer: {
        title_ua: 'Літо',
        title_en: 'Summer',
        params: {
            months: [7, 8, 9],
        },
    },
    fall: {
        title_ua: 'Осінь',
        title_en: 'Fall',
        params: {
            months: [10, 11, 12],
        },
    },
};

export const RELEASE_STATUS: Hikka.FilterProperty<ContentStatusEnum> = {
    [ContentStatusEnum.DISCONTINUED]: {
        title_ua: 'Припинено',
        title_en: 'Discontinued',
    },
    [ContentStatusEnum.ONGOING]: {
        title_ua: 'Онґоінґ',
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
        title_ua: 'Зупинено',
        title_en: 'Paused',
    },
};

export const ANIME_MEDIA_TYPE: Hikka.FilterProperty<AnimeMediaEnum> = {
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

export const MANGA_MEDIA_TYPE: Hikka.FilterProperty<MangaMediaEnum> = {
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

export const NOVEL_MEDIA_TYPE: Hikka.FilterProperty<NovelMediaEnum> = {
    [NovelMediaEnum.LIGHT_NOVEL]: {
        title_ua: 'Ранобе',
        title_en: 'Light Novel',
    },
    [NovelMediaEnum.NOVEL]: {
        title_ua: 'Веб-новела',
        title_en: 'Novel',
    },
};

export const MEDIA_TYPE: Hikka.FilterProperty<
    NovelMediaEnum | MangaMediaEnum | AnimeMediaEnum
> = {
    ...ANIME_MEDIA_TYPE,
    ...MANGA_MEDIA_TYPE,
    ...NOVEL_MEDIA_TYPE,
};

export const AGE_RATING: Hikka.FilterProperty<AnimeAgeRatingEnum> = {
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

export const VIDEO: Hikka.FilterProperty<AnimeVideoTypeEnum> = {
    [AnimeVideoTypeEnum.VIDEO_PROMO]: {
        title_ua: 'Промо-відео',
        title_en: 'Promo Video',
    },
    [AnimeVideoTypeEnum.VIDEO_MUSIC]: {
        title_ua: 'Музичне Відео',
        title_en: 'Music Video',
    },
};

export const OST: Hikka.FilterProperty<AnimeOSTTypeEnum> = {
    [AnimeOSTTypeEnum.OPENING]: {
        title_ua: 'Опенінґ',
        title_en: 'Opening',
    },
    [AnimeOSTTypeEnum.ENDING]: {
        title_ua: 'Ендінґ',
        title_en: 'Ending',
    },
};

export const SOURCE: Hikka.FilterProperty<SourceEnum> = {
    [SourceEnum.DIGITAL_MANGA]: {
        title_ua: 'Цифрова Манґа',
        title_en: 'Digital Manga',
    },
    [SourceEnum.PICTURE_BOOK]: {
        title_ua: 'Книга з Ілюстраціями',
        title_en: 'Picture Book',
    },
    [SourceEnum.VISUAL_NOVEL]: {
        title_ua: 'Візуальна Новала',
        title_en: 'Visual Novel',
    },
    [SourceEnum.KOMA_MANGA]: {
        title_ua: 'Чотирьохпанельна Манґа',
        title_en: 'Yonkoma manga',
    },
    [SourceEnum.LIGHT_NOVEL]: {
        title_ua: 'Ранобе',
        title_en: 'Light Novel',
    },
    [SourceEnum.CARD_GAME]: {
        title_ua: 'Карткова Гра',
        title_en: 'Card Game',
    },
    [SourceEnum.WEB_MANGA]: {
        title_ua: 'Веб-манга',
        title_en: 'Web Manga',
    },
    [SourceEnum.ORIGINAL]: {
        title_ua: 'Оригінальний Твір',
        title_en: 'Original',
    },
    [SourceEnum.MANGA]: {
        title_ua: 'Манґа',
        title_en: 'Manga',
    },
    [SourceEnum.MUSIC]: {
        title_ua: 'Музика',
        title_en: 'Music',
    },
    [SourceEnum.NOVEL]: {
        title_ua: 'Новела',
        title_en: 'Novel',
    },
    [SourceEnum.OTHER]: {
        title_ua: 'Інше',
        title_en: 'Other',
    },
    [SourceEnum.RADIO]: {
        title_ua: 'Радіо',
        title_en: 'Radio',
    },
    [SourceEnum.GAME]: {
        title_ua: 'Гра',
        title_en: 'Game',
    },
    [SourceEnum.BOOK]: {
        title_ua: 'Книга',
        title_en: 'Book',
    },
};

export const GENRE_TYPES: Hikka.FilterProperty<GenreTypeEnum> = {
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

export const ERRORS: Record<string, Record<string, string>> = {
    auth: {
        activation_valid:
            'Попередній токен активації поштової скиньки все ще дійсний.',
        reset_valid: 'Попередній токен зміни паролю все ще активний.',
        email_exists: 'Користувач з даною поштою вже зареєстрований.',
        activation_expired:
            'Термін дії токену активації поштової скриньки минув.',
        activation_invalid: 'Токен активації поштової скиньки недійсний.',
        oauth_code_required: 'Потрібен OAuth код.',
        invalid_provider: 'Невірний OAuth провайдер.',
        username_taken: 'Імʼя користувача вже зайнято.',
        reset_expired: 'Термін дії токену зміни паролю минув.',
        reset_invalid: 'Токен зміни паролю недійсний.',
        already_activated: 'Вже активовано.',
        invalid_token: 'Токен авторизації недійсний',
        missing_token: 'Токен авторизації відсутній.',
        invalid_password: 'Невірний пароль.',
        username_set: 'Імʼя користувача вже встановлено.',
        token_expired: 'Термін токену авторизації минув.',
        invalid_code: 'OAuth код недійсний.',
        oauth_error: 'Виникла помилка під час OAuth авторизації.',
        user_not_found: 'Користувача не знайдено.',
        email_set: 'Email вже використовується',
        not_available: 'Реєстрація недоступна',
    },
    settings: {
        username_cooldown:
            'Імʼя користувача можна змінювати один раз в годину.',
        email_cooldown: 'Поштову скриньку можна змінювати один раз на день.',
        username_taken: 'Імʼя користувача вже зайнято.',
    },
    permission: {
        denied: 'Ви не маєте дозволу для виконання цієї дії.',
    },
    anime: {
        no_franchise: "Це аніме не має пов'язаного",
        unknown_producer: 'Невідомий продюсер',
        unknown_studio: 'Невідома студія',
        bad_year: 'Неправильний рік',
        unknown_genre: 'Невідомий жанр',
        not_found: 'Аніме не знайдено',
    },
    edit: {
        not_pending:
            'Можна змінювати лише ті правки, які очікують на перевірку',
        not_author: 'Тільки автор може змінювати правку',
        invalid_content_id: 'Неправильний ідентифікатор контенту',
        content_not_found: 'Контент не знайдено',
        bad_edit: 'Ця правка є недійсною',
        invalid_field: 'Неправильне поле',
        not_found: 'Правку не знайдено',
    },
    studio: {
        not_found: 'Студію не знайдено',
    },
    genre: {
        not_found: 'Жанр не знайдено',
    },
    watch: {
        bad_episodes: 'Неправильний номер епізодів',
        not_found: 'Запис перегляду не знайдено',
    },
    favourite: {
        exists: 'Улюблений запис для цього аніме вже існує',
        not_found: 'Улюблений запис не знайдено',
    },
    captcha: {
        invalid: 'Не вдалося підтвердити капчу',
    },
    user: {
        not_found: 'Користувача не знайдено.',
    },
    follow: {
        already_following: 'Ви вже підписані на цього користувача',
        not_following: 'Ви не підписані на цього користувача',
        invalid_action: 'Недійсна дія',
        self: 'Не можна підписатися на себе',
    },
    search: {
        query_down: 'Пошук тимчасово недоступний',
    },
    company: {
        not_found: 'Компанію не знайдено',
    },
    character: {
        not_found: 'Персонажа не знайдено',
    },
    person: {
        not_found: 'Людину не знайдено',
    },
};

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

export enum DateRangeEnum {
    CURRENT_SEASON = 'current_season',
    SEASON_1 = 'season_1',
    SEASON_2 = 'season_2',
    SEASON_3 = 'season_3',
    YEAR = 'year',
}

export const DATE_RANGES: Hikka.FilterProperty<DateRangeEnum> = {
    [DateRangeEnum.CURRENT_SEASON]: {
        title_ua: 'Поточний сезон',
        title_en: 'Current season',
    },
    [DateRangeEnum.SEASON_1]: {
        title_ua: 'Один сезон',
        title_en: 'One season',
    },
    [DateRangeEnum.SEASON_2]: {
        title_ua: 'Два сезони',
        title_en: 'Two seasons',
    },
    [DateRangeEnum.SEASON_3]: {
        title_ua: 'Три сезони',
        title_en: 'Three seasons',
    },
    [DateRangeEnum.YEAR]: {
        title_ua: 'Рік',
        title_en: 'Year',
    },
};

export const COLLECTION_CONTENT_TYPE_OPTIONS = [
    {
        value: 'anime',
        label: 'Аніме',
    },
    {
        value: 'manga',
        label: 'Манґа',
    },
    {
        value: 'novel',
        label: 'Ранобе',
    },
    {
        value: 'character',
        label: 'Персонаж',
    },
    {
        value: 'person',
        label: 'Людина',
    },
];

export const COLLECTION_VISIBILITY_OPTIONS = [
    {
        value: 'public',
        label: 'Публічна',
    },
    {
        value: 'private',
        label: 'Приватна',
    },
    {
        value: 'unlisted',
        label: 'Лише у профілі',
    },
];

export const USER_ROLE = {
    admin: {
        label: 'Адміністратор',
        color: '#468F40',
    },
    moderator: {
        label: 'Модератор',
        color: '#40518F',
    },
};
export const READ_STATUS: Hikka.FilterProperty<ReadStatusEnum> = {
    [ReadStatusEnum.PLANNED]: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
        icon: Planned,
    },
    [ReadStatusEnum.COMPLETED]: {
        title_ua: 'Завершено',
        title_en: 'Completed',
        icon: Completed,
    },
    [ReadStatusEnum.ON_HOLD]: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
        icon: MaterialSymbolsBookmarkFlagOutlineRounded,
    },
    [ReadStatusEnum.DROPPED]: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
        icon: Dropped,
    },
    [ReadStatusEnum.READING]: {
        title_ua: 'Читаю',
        title_en: 'Reading',
        icon: MaterialSymbolsBookmarkOutline,
    },
};

export const WATCH_STATUS: Hikka.FilterProperty<WatchStatusEnum> = {
    [WatchStatusEnum.PLANNED]: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
        icon: Planned,
    },
    [WatchStatusEnum.WATCHING]: {
        title_ua: 'Дивлюсь',
        title_en: 'Watching',
        icon: Watching,
    },
    [WatchStatusEnum.COMPLETED]: {
        title_ua: 'Завершено',
        title_en: 'Completed',
        icon: Completed,
    },
    [WatchStatusEnum.ON_HOLD]: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
        icon: OnHold,
    },
    [WatchStatusEnum.DROPPED]: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
        icon: Dropped,
    },
};

export const ARTICLE_CATEGORY_OPTIONS: Hikka.FilterProperty<
    ArticleCategoryEnum,
    { admin?: boolean }
> = {
    [ArticleCategoryEnum.NEWS]: {
        title_ua: 'Новини',
        title_en: 'News',
        icon: MaterialSymbolsNewsmodeRounded,
    },
    [ArticleCategoryEnum.SYSTEM]: {
        title_ua: 'Системне',
        title_en: 'System',
        admin: true,
    },
    [ArticleCategoryEnum.REVIEWS]: {
        title_ua: 'Огляди',
        title_en: 'Reviews',
        icon: MaterialSymbolsReviewsRounded,
    },
    [ArticleCategoryEnum.ORIGINAL]: {
        title_ua: 'Авторське',
        title_en: 'Original',
        icon: MaterialSymbolsStarsRounded,
    },
};

export const COMMENT_DECLENSIONS: [string, string, string] = [
    'коментар',
    'коментарі',
    'коментарів',
];

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

export const CONTENT_CONFIG = {
    [ContentTypeEnum.ANIME]: ANIME_CONFIG,
    [ContentTypeEnum.MANGA]: MANGA_CONFIG,
    [ContentTypeEnum.NOVEL]: NOVEL_CONFIG,
};
