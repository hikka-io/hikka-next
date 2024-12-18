import MaterialSymbolsBookmarkFlagOutlineRounded from '~icons/material-symbols/bookmark-flag-outline-rounded';
import MaterialSymbolsBookmarkOutline from '~icons/material-symbols/bookmark-outline';

import Completed from '@/components/icons/watch-status/completed';
import Dropped from '@/components/icons/watch-status/dropped';
import OnHold from '@/components/icons/watch-status/on-hold';
import Planned from '@/components/icons/watch-status/planned';
import Watching from '@/components/icons/watch-status/watching';

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

export const MEDIA_TYPE: Hikka.FilterProperty<
    API.NovelMediaType | API.MangaMediaType | API.AnimeMediaType
> = {
    ...ANIME_MEDIA_TYPE,
    ...MANGA_MEDIA_TYPE,
    ...NOVEL_MEDIA_TYPE,
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

export const ARTICLE_CATEGORY_OPTIONS = [
    {
        value: 'news',
        label: 'Новини',
    },
];
