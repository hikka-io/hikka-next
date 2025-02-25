import MaterialAnimatedImages from '~icons/material-symbols/animated-images';
import MaterialSymbolsCalendarClockRounded from '~icons/material-symbols/calendar-clock-rounded';
import MaterialSymbolsCustomTypographyRounded from '~icons/material-symbols/custom-typography-rounded';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';
import MaterialSymbolsEventListRounded from '~icons/material-symbols/event-list-rounded';
import MaterialSymbolsHomeRounded from '~icons/material-symbols/home-rounded';
import MaterialSymbolsLockOpenRounded from '~icons/material-symbols/lock-open-rounded';
import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsNotificationsActiveRounded from '~icons/material-symbols/notifications-active-rounded';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsPersonRounded from '~icons/material-symbols/person-rounded';
import MaterialSymbolsStack from '~icons/material-symbols/stack';
import MdiPuzzle from '~icons/mdi/puzzle';

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
        slug: 'anime-list',
        title_ua: 'Список аніме',
        url: '/list/anime',
    },
    {
        slug: 'manga-list',
        title_ua: 'Список манґи',
        url: '/list/manga',
    },
    {
        slug: 'ranobe-list',
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
    {
        slug: 'settings',
        title_ua: 'Налаштування',
        url: '/settings',
        visible: false,
    },
];
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

export const SETTINGS_MENU = [
    {
        title: 'Профіль',
        icon: MaterialSymbolsPersonRounded,
        href: '/settings/profile',
    },
    {
        title: 'Безпека',
        icon: MaterialSymbolsLockOpenRounded,
        href: '/settings/security',
    },
    {
        title: 'Список',
        icon: MaterialSymbolsEventListRounded,
        href: '/settings/list',
    },
    {
        title: 'Сповіщення',
        icon: MaterialSymbolsNotificationsActiveRounded,
        href: '/settings/notifications',
    },
    {
        title: 'Кастомізація',
        icon: MaterialSymbolsCustomTypographyRounded,
        href: '/settings/customization',
    },
    {
        title: 'Застосунки',
        icon: MdiPuzzle,
        href: '/settings/applications',
    },
];
