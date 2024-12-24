import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsCustomTypographyRounded from '@/components/icons/material-symbols/MaterialSymbolsCustomTypographyRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsEventListRounded from '@/components/icons/material-symbols/MaterialSymbolsEventListRounded';
import MaterialSymbolsHomeRounded from '@/components/icons/material-symbols/MaterialSymbolsHomeRounded';
import MaterialSymbolsLockOpenRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRounded';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsNewsmodeRounded from '@/components/icons/material-symbols/MaterialSymbolsNewsmodeRounded';
import MaterialSymbolsNotificationsActiveRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationsActiveRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import MdiPuzzle from '@/components/icons/mdi/MdiPuzzle';

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
        icon: MaterialSymbolsAnimatedImages,
        visible: true,
        group: 'Контент',
    },
    {
        slug: 'manga',
        title_ua: 'Манґа',
        url: '/manga',
        icon: MaterialSymbolsPalette,
        visible: true,
        group: 'Контент',
    },
    {
        slug: 'novel',
        title_ua: 'Ранобе',
        url: '/novel',
        icon: MaterialSymbolsMenuBookRounded,
        visible: true,
        group: 'Контент',
    },
    {
        slug: 'edit',
        title_ua: 'Правки',
        url: '/edit',
        icon: MaterialSymbolsEditRounded,
        visible: true,
        group: 'Модерація',
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
        group: 'Спільнота',
    },
    {
        slug: 'news',
        title_ua: 'Новини',
        url: '/news',
        icon: MaterialSymbolsNewsmodeRounded,
        visible: true,
        group: 'Спільнота',
    },
    {
        slug: 'schedule',
        title_ua: 'Календар',
        url: '/schedule',
        icon: MaterialSymbolsCalendarClockRounded,
        visible: true,
        group: 'Інше',
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
    article: '/articles',
};

export const SETTINGS_MENU = [
    {
        title: 'Профіль',
        icon: MaterialSymbolsPerson,
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
