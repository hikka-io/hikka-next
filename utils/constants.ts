import MaterialAnimatedImages from '~icons/material-symbols/animated-images';
import MaterialSymbolsBookmarkFlagOutlineRounded from '~icons/material-symbols/bookmark-flag-outline-rounded';
import MaterialSymbolsBookmarkOutline from '~icons/material-symbols/bookmark-outline';
import MaterialSymbolsCalendarClockRounded from '~icons/material-symbols/calendar-clock-rounded';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';
import MaterialSymbolsHomeRounded from '~icons/material-symbols/home-rounded';
import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsStack from '~icons/material-symbols/stack';

import Completed from '@/components/icons/watch-status/completed';
import Dropped from '@/components/icons/watch-status/dropped';
import OnHold from '@/components/icons/watch-status/on-hold';
import Planned from '@/components/icons/watch-status/planned';
import Watching from '@/components/icons/watch-status/watching';

export const READ_STATUS: Hikka.FilterProperty<API.ReadStatus> = {
    planned: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
        icon: Planned,
        color: '#AB872B',
    },
    completed: {
        title_ua: 'Завершено',
        title_en: 'Completed',
        icon: Completed,
        color: '#399A54',
    },
    on_hold: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
        icon: MaterialSymbolsBookmarkFlagOutlineRounded,
        color: '#5C5C5C',
    },
    dropped: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
        icon: Dropped,
        color: '#952828',
    },
    reading: {
        title_ua: 'Читаю',
        title_en: 'Reading',
        icon: MaterialSymbolsBookmarkOutline,
        color: '#2B94AB',
    },
};

export const WATCH_STATUS: Hikka.FilterProperty<API.WatchStatus> = {
    planned: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
        icon: Planned,
        color: '#AB872B',
    },
    watching: {
        title_ua: 'Дивлюсь',
        title_en: 'Watching',
        icon: Watching,
        color: '#2B94AB',
    },
    completed: {
        title_ua: 'Завершено',
        title_en: 'Completed',
        icon: Completed,
        color: '#399A54',
    },
    on_hold: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
        icon: OnHold,
        color: '#5C5C5C',
    },
    dropped: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
        icon: Dropped,
        color: '#952828',
    },
};

export const SEASON: Hikka.FilterProperty<API.Season> = {
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

export const RELEASE_STATUS: Hikka.FilterProperty<API.Status> = {
    discontinued: {
        title_ua: 'Припинено',
        title_en: 'Discontinued',
        color: '#952828',
    },
    ongoing: {
        title_ua: 'Онґоінґ',
        title_en: 'Ongoing',

        color: '#2B94AB',
    },
    finished: {
        title_ua: 'Завершено',
        title_en: 'Finished',
        color: '#518146',
    },
    announced: {
        title_ua: 'Анонс',
        title_en: 'Announced',
        color: '#AB872B',
    },

    paused: {
        title_ua: 'Зупинено',
        title_en: 'Paused',
        color: '#5C5C5C',
    },
};

export const ANIME_MEDIA_TYPE: Hikka.FilterProperty<API.AnimeMediaType> = {
    special: {
        title_ua: 'Спешл',
        title_en: 'Special',
    },
    movie: {
        title_ua: 'Фільм',
        title_en: 'Movie',
    },
    ova: {
        title_ua: 'OVA',
        title_en: 'OVA',
    },
    ona: {
        title_ua: 'ONA',
        title_en: 'ONA',
    },
    tv: {
        title_ua: 'TV Серіал',
        title_en: 'TV',
    },
    music: {
        title_ua: 'Музика',
        title_en: 'Music',
    },
};

export const MANGA_MEDIA_TYPE: Hikka.FilterProperty<API.MangaMediaType> = {
    one_shot: {
        title_ua: 'Ваншот',
        title_en: 'One Shot',
    },
    doujin: {
        title_ua: 'Доджінші',
        title_en: 'Doujin',
    },
    manhua: {
        title_ua: 'Манхуа',
        title_en: 'Manhua',
    },
    manhwa: {
        title_ua: 'Манхва',
        title_en: 'Manhwa',
    },
    manga: {
        title_ua: 'Манґа',
        title_en: 'Manga',
    },
};

export const NOVEL_MEDIA_TYPE: Hikka.FilterProperty<API.NovelMediaType> = {
    light_novel: {
        title_ua: 'Ранобе',
        title_en: 'Light Novel',
    },
    novel: {
        title_ua: 'Веб-новела',
        title_en: 'Novel',
    },
};

export const AGE_RATING: Hikka.FilterProperty<API.AgeRating> = {
    g: {
        title_ua: 'G',
        title_en: 'G',
        description: 'Немає вікових обмежень',
    },
    pg: {
        title_ua: 'PG',
        title_en: 'PG',
        description: 'Рекомендується присутність батьків',
    },
    pg_13: {
        title_ua: 'PG-13',
        title_en: 'PG-13',
        description: 'Дітям до 13 років перегляд небажаний',
    },
    r: {
        title_ua: 'R',
        title_en: 'R',
        description: 'Особам до 18 років обовʼязкова присутність дорослого',
    },
    r_plus: {
        title_ua: 'R PLUS',
        title_en: 'R PLUS',
        description: 'Особам до 18 років перегляд заборонений',
    },
    rx: {
        title_ua: 'RX',
        title_en: 'RX',
        description: 'Хентай',
    },
};

export const VIDEO: Hikka.FilterProperty<API.VideoType> = {
    video_promo: {
        title_ua: 'Промо-відео',
        title_en: 'Promo Video',
    },
    video_music: {
        title_ua: 'Музичне Відео',
        title_en: 'Music Video',
    },
};

export const OST: Hikka.FilterProperty<API.OSTType> = {
    opening: {
        title_ua: 'Опенінґ',
        title_en: 'Opening',
    },
    ending: {
        title_ua: 'Ендінґ',
        title_en: 'Ending',
    },
};

export const SOURCE: Hikka.FilterProperty<API.Source> = {
    digital_manga: {
        title_ua: 'Цифрова Манґа',
        title_en: 'Digital Manga',
    },
    picture_book: {
        title_ua: 'Книга з Ілюстраціями',
        title_en: 'Picture Book',
    },
    visual_novel: {
        title_ua: 'Візуальна Новала',
        title_en: 'Visual Novel',
    },
    '4_koma_manga': {
        title_ua: 'Чотирьохпанельна Манґа',
        title_en: 'Yonkoma manga',
    },
    light_novel: {
        title_ua: 'Ранобе',
        title_en: 'Light Novel',
    },
    card_game: {
        title_ua: 'Карткова Гра',
        title_en: 'Card Game',
    },
    web_manga: {
        title_ua: 'Веб-манга',
        title_en: 'Web Manga',
    },
    original: {
        title_ua: 'Оригінальний Твір',
        title_en: 'Original',
    },
    manga: {
        title_ua: 'Манґа',
        title_en: 'Manga',
    },
    music: {
        title_ua: 'Музика',
        title_en: 'Music',
    },
    novel: {
        title_ua: 'Новела',
        title_en: 'Novel',
    },
    other: {
        title_ua: 'Інше',
        title_en: 'Other',
    },
    radio: {
        title_ua: 'Радіо',
        title_en: 'Radio',
    },
    game: {
        title_ua: 'Гра',
        title_en: 'Game',
    },
    book: {
        title_ua: 'Книга',
        title_en: 'Book',
    },
};

export const EDIT_STATUS: Hikka.FilterProperty<API.EditStatus> = {
    pending: {
        title_ua: 'На Розгляді',
        title_en: 'Pending',
        color: '#AB872B',
    },
    accepted: {
        title_ua: 'Прийнято',
        title_en: 'Accepted',
        color: '#518146',
    },
    denied: {
        title_ua: 'Відхилено',
        title_en: 'Denied',
        color: '#952828',
    },
    closed: {
        title_ua: 'Закрито',
        title_en: 'Closed',
        color: '#5C5C5C',
    },
};

export const GENRE_TYPES: Hikka.FilterProperty<API.GenreType> = {
    theme: {
        title_ua: 'Тематичне',
        title_en: 'Theme',
    },
    explicit: {
        title_ua: 'Для дорослих',
        title_en: 'Explicit',
    },
    genre: {
        title_ua: 'Основне',
        title_en: 'General',
    },
    demographic: {
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
        email_set: 'Email already set',
        not_available: 'Signup not available',
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
        no_franchise: "This anime doesn't have franchise",
        unknown_producer: 'Unknown producer',
        unknown_studio: 'Unknown studio',
        bad_year: 'Invalid years passed',
        unknown_genre: 'Unknown genre',
        not_found: 'Anime not found',
    },
    edit: {
        not_pending: 'Only pending edit can be changed',
        not_author: 'Only author can modify edit',
        invalid_content_id: 'Invalid content id',
        content_not_found: 'Content not found',
        bad_edit: 'This edit is invalid',
        invalid_field: 'Invalid field',
        not_found: 'Edit not found',
    },
    studio: {
        not_found: 'Studio not found',
    },
    genre: {
        not_found: 'Genre not found',
    },
    watch: {
        bad_episodes: 'Bad episodes number provided',
        not_found: 'Watch record not found',
    },
    favourite: {
        exists: 'Favourite record for this anime already exists',
        not_found: 'Favourite record not found',
    },
    captcha: {
        invalid: 'Failed to validate captcha',
    },
    user: {
        not_found: 'Користувача не знайдено.',
    },
    follow: {
        already_following: 'This user is already followed',
        not_following: 'This user is not followed',
        invalid_action: 'Invalid action',
        self: "Can't follow self",
    },
    search: {
        query_down: 'Search by query unavailable at the moment',
    },
    company: {
        not_found: 'Company not found',
    },
    character: {
        not_found: 'Character not found',
    },
    person: {
        not_found: 'Person not found',
    },
};

export const GENERAL_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'anime',
        title_ua: 'Головна',
        url: '/home',
        icon: MaterialSymbolsHomeRounded,
        visible: false,
    },
    {
        slug: 'anime',
        title_ua: 'Аніме',
        url: '/anime',
        icon: MaterialAnimatedImages,
        visible: true,
    },
    {
        slug: 'manga',
        title_ua: 'Манґа',
        url: '/manga',
        icon: MaterialSymbolsPalette,
        visible: true,
    },
    {
        slug: 'novel',
        title_ua: 'Ранобе',
        url: '/novel',
        icon: MaterialSymbolsMenuBookRounded,
        visible: true,
    },
    {
        slug: 'edit',
        title_ua: 'Правки',
        url: '/edit',
        icon: MaterialSymbolsEditRounded,
        visible: true,
    },
    {
        slug: 'users',
        title_ua: 'Користувачі',
        url: '/u',
        visible: false,
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
        visible: false,
    },
    {
        slug: 'people',
        title_ua: 'Люди',
        url: '/people',
        visible: false,
    },
    {
        slug: 'comments',
        title_ua: 'Коментарі',
        url: '/comments',
        visible: false,
    },
    {
        slug: 'characters',
        title_ua: 'Колекції',
        url: '/collections',
        icon: MaterialSymbolsStack,
        visible: true,
    },
    {
        slug: 'schedule',
        title_ua: 'Календар',
        url: '/schedule',
        icon: MaterialSymbolsCalendarClockRounded,
        visible: true,
    },
];

export const NOVEL_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
    },
];

export const MANGA_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
    },
];

export const ANIME_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
    },
    {
        slug: 'franchise',
        title_ua: "Пов'язане",
        url: '/franchise',
    },
    {
        slug: 'media',
        title_ua: 'Медіа',
        url: '/media',
    },
    {
        slug: 'staff',
        title_ua: 'Автори',
        url: '/staff',
    },
];

export const CHARACTER_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'voices',
        title_ua: 'Сейю',
        url: '/voices',
    },
    {
        slug: 'anime',
        title_ua: 'Аніме',
        url: '/anime',
    },
    {
        slug: 'anime',
        title_ua: 'Манґа',
        url: '/manga',
    },
    {
        slug: 'anime',
        title_ua: 'Ранобе',
        url: '/novel',
    },
];

export const PERSON_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'anime',
        title_ua: 'Аніме',
        url: '/anime',
    },
    {
        slug: 'anime',
        title_ua: 'Манґа',
        url: '/manga',
    },
    {
        slug: 'anime',
        title_ua: 'Ранобе',
        url: '/novel',
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
    },
];

export const USER_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'list',
        title_ua: 'Список аніме',
        url: '/list/anime',
    },
    {
        slug: 'list',
        title_ua: 'Список манґи',
        url: '/list/manga',
    },
    {
        slug: 'list',
        title_ua: 'Список ранобе',
        url: '/list/novel',
    },
    {
        slug: 'favorites',
        title_ua: 'Улюблені',
        url: '/favorites',
    },
];

export const EDIT_NAV_ROUTES: Hikka.NavRoute[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'content',
        title_ua: 'Контент',
        url: '/content',
    },
];

export const ANIME_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'title_ua',
            title: 'Українською',
            placeholder: 'Введіть назву українською',
            type: 'input',
        },
        {
            slug: 'title_en',
            title: 'Англійською',
            placeholder: 'Введіть назву англійською',
            type: 'input',
        },
        {
            slug: 'title_ja',
            title: 'Японською',
            placeholder: 'Введіть назву японською',
            type: 'input',
        },
    ],

    synopsis: [
        {
            slug: 'synopsis_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
        {
            slug: 'synopsis_en',
            title: 'Англійською',
            placeholder: 'Введіть опис англійською',
            type: 'markdown',
        },
    ],
    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const ANIME_EDIT_GROUPS: Record<string, string> = {
    title: 'Назва',
    synopsis: 'Опис',
    synonyms: 'Синоніми',
};

export const MANGA_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'title_ua',
            title: 'Українською',
            placeholder: 'Введіть назву українською',
            type: 'input',
        },
        {
            slug: 'title_en',
            title: 'Англійською',
            placeholder: 'Введіть назву англійською',
            type: 'input',
        },
        {
            slug: 'title_original',
            title: 'Японською',
            placeholder: 'Введіть назву японською',
            type: 'input',
        },
    ],

    synopsis: [
        {
            slug: 'synopsis_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
        {
            slug: 'synopsis_en',
            title: 'Англійською',
            placeholder: 'Введіть опис англійською',
            type: 'markdown',
        },
    ],
    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const MANGA_EDIT_GROUPS: Record<string, string> = {
    title: 'Назва',
    synopsis: 'Опис',
    synonyms: 'Синоніми',
};

export const NOVEL_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'title_ua',
            title: 'Українською',
            placeholder: 'Введіть назву українською',
            type: 'input',
        },
        {
            slug: 'title_en',
            title: 'Англійською',
            placeholder: 'Введіть назву англійською',
            type: 'input',
        },
        {
            slug: 'title_original',
            title: 'Японською',
            placeholder: 'Введіть назву японською',
            type: 'input',
        },
    ],

    synopsis: [
        {
            slug: 'synopsis_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
        {
            slug: 'synopsis_en',
            title: 'Англійською',
            placeholder: 'Введіть опис англійською',
            type: 'markdown',
        },
    ],
    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const NOVEL_EDIT_GROUPS: Record<string, string> = {
    title: 'Назва',
    synopsis: 'Опис',
    synonyms: 'Синоніми',
};

export const EDIT_PARAMS: Record<
    | keyof Hikka.AnimeEditParams
    | keyof Hikka.MangaEditParams
    | keyof Hikka.NovelEditParams
    | keyof Hikka.CharacterEditParams
    | keyof Hikka.PersonEditParams,
    string
> = {
    name_ua: 'Імʼя UA',
    name_en: 'Імʼя EN',
    name_ja: 'Імʼя JA',
    description_ua: 'Опис UA',
    synonyms: 'Синоніми',
    title_ua: 'Назва UA',
    title_en: 'Назва EN',
    title_ja: 'Назва JA',
    title_original: 'Назва JA',
    synopsis_ua: 'Опис UA',
    synopsis_en: 'Опис EN',
    name_native: 'Рідне імʼя',
};

export const CHARACTER_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'name_ua',
            title: 'Українською',
            placeholder: 'Введіть імʼя українською',
            type: 'input',
        },
        {
            slug: 'name_en',
            title: 'Англійською',
            placeholder: 'Введіть імʼя англійською',
            type: 'input',
        },
        {
            slug: 'name_ja',
            title: 'Японською',
            placeholder: 'Введіть імʼя японською',
            type: 'input',
        },
    ],

    description: [
        {
            slug: 'description_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
    ],

    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const CHARACTER_EDIT_GROUPS: Record<string, string> = {
    title: 'Імʼя',
    description: 'Опис',
    synonyms: 'Синоніми',
};

export const PERSON_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'name_ua',
            title: 'Українською',
            placeholder: 'Введіть імʼя українською',
            type: 'input',
        },
        {
            slug: 'name_en',
            title: 'Англійською',
            placeholder: 'Введіть імʼя англійською',
            type: 'input',
        },
        {
            slug: 'name_native',
            title: 'Рідною',
            placeholder: 'Введіть рідне імʼя',
            type: 'input',
        },
    ],

    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const PERSON_EDIT_GROUPS: Record<string, string> = {
    title: 'Імʼя',
    synonyms: 'Синоніми',
};

export const CONTENT_TYPES: Hikka.FilterProperty<API.ContentType | 'user'> = {
    anime: {
        title_ua: 'Аніме',
        title_en: 'Anime',
    },
    character: {
        title_ua: 'Персонаж',
        title_en: 'Character',
    },
    person: {
        title_ua: 'Автор',
        title_en: 'Person',
    },
    edit: {
        title_ua: 'Правка',
        title_en: 'Edit',
    },
    comment: {
        title_ua: 'Коментар',
        title_en: 'Comment',
    },
    collection: {
        title_ua: 'Колекція',
        title_en: 'Collection',
    },
    manga: {
        title_ua: 'Манґа',
        title_en: 'Manga',
    },
    novel: {
        title_ua: 'Ранобе',
        title_en: 'Ranobe',
    },
    user: {
        title_ua: 'Користувач',
        title_en: 'User',
    },
};

export const EDIT_STATUSES: Hikka.FilterProperty<API.EditStatus> = {
    pending: {
        title_ua: 'На розгляді',
        title_en: 'Pending',
        color: '#AB872B',
    },
    accepted: {
        title_ua: 'Прийнято',
        title_en: 'Accepted',
        color: '#518146',
    },
    denied: {
        title_ua: 'Відхилено',
        title_en: 'Denied',
        color: '#952828',
    },
    closed: {
        title_ua: 'Закрито',
        title_en: 'Closed',
        color: '#5C5C5C',
    },
};

export const CONTENT_TYPE_LINKS: Record<API.ContentType, string> = {
    person: '/people',
    character: '/characters',
    anime: '/anime',
    edit: '/edit',
    comment: '/comments',
    collection: '/collections',
    manga: '/manga',
    novel: '/novel',
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

export const WARNING_WORDS = [
    atob('UnVzc2lh'), 
    atob('UnVzc2lhbg=='),
]
