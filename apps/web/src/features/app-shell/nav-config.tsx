import { ChartLine, FilePenLine, MessageCircle, UsersIcon } from 'lucide-react';

import { ContentTypeEnum } from '@hikka/api';

import BxBxlGithub from '@/components/icons/bx/BxBxlGithub';
import BxBxlMastadon from '@/components/icons/bx/BxBxlMastadon';
import BxBxlTelegram from '@/components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '@/components/icons/bx/BxBxsDonateHeart';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import MaterialSymbolsHomeRounded from '@/components/icons/material-symbols/MaterialSymbolsHomeRounded';
import MaterialSymbolsLockOpenRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRounded';
import MaterialSymbolsLoginRounded from '@/components/icons/material-symbols/MaterialSymbolsLoginRounded';
import MaterialSymbolsPersonAddOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddOutlineRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import PhTipJarFill from '@/components/icons/ph/PhTipJarFill';
import type { NavRoute } from '@/utils/navigation';

const TELEGRAM_URL = 'https://t.me/hikka_io';
const DONATELLO_URL = 'https://donatello.to/hikka.io';

const CONTENT_GROUP: NavRoute[] = [
    {
        title_ua: 'Аніме',
        url: '/anime',
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.ANIME],
        visible: true,
        slug: 'anime',
    },
    {
        title_ua: 'Манґа',
        url: '/manga',
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.MANGA],
        visible: true,
        slug: 'manga',
    },
    {
        title_ua: 'Ранобе',
        url: '/novel',
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.NOVEL],
        visible: true,
        slug: 'novel',
    },
];

const COMMUNITY_GROUP: NavRoute[] = [
    {
        title_ua: 'Статті',
        url: '/articles',
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.ARTICLE],
        visible: true,
        slug: 'articles',
    },
    {
        title_ua: 'Колекції',
        url: '/collections',
        search: { page: 1 },
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.COLLECTION],
        visible: true,
        slug: 'collections',
    },
];

const MODERATION_GROUP: NavRoute[] = [
    {
        title_ua: 'Правки',
        url: '/edit',
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.EDIT],
        visible: true,
        slug: 'edit',
    },
    {
        title_ua: 'Незаповнений контент',
        url: '/edit/content',
        icon: () => <FilePenLine />,
        visible: true,
        slug: 'edit-content',
    },
];

const OTHER_GROUP: NavRoute[] = [
    {
        title_ua: 'Налаштування',
        url: '/settings',
        icon: () => <MaterialSymbolsSettingsOutlineRounded />,
        visible: false,
        slug: 'settings',
    },
    {
        title_ua: 'Календар',
        url: '/schedule',
        icon: () => <MaterialSymbolsCalendarClockRounded />,
        visible: true,
        slug: 'schedule',
    },
    {
        title_ua: 'Головна',
        url: '/',
        icon: () => <MaterialSymbolsHomeRounded />,
        visible: false,
        slug: 'home',
    },
    {
        title_ua: 'Користувачі',
        url: '/u',
        icon: () => <UsersIcon />,
        visible: false,
        slug: 'users',
    },
    {
        title_ua: 'Персонажі',
        url: '/characters',
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.CHARACTER],
        visible: false,
        slug: 'characters',
    },
    {
        title_ua: 'Люди',
        url: '/people',
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.PERSON],
        visible: false,
        slug: 'people',
    },
    {
        title_ua: 'Коментарі',
        url: '/comments',
        icon: () => <MessageCircle />,
        visible: false,
        slug: 'comments',
    },
    {
        title_ua: 'Вхід',
        url: '/login',
        icon: () => <MaterialSymbolsLoginRounded />,
        visible: false,
        slug: 'login',
    },
    {
        title_ua: 'Реєстрація',
        url: '/signup',
        icon: () => <MaterialSymbolsPersonAddOutlineRounded />,
        visible: false,
        slug: 'signup',
    },
    {
        title_ua: 'Відновити пароль',
        url: '/reset',
        icon: () => <MaterialSymbolsLockOpenRounded />,
        visible: false,
        slug: 'reset',
    },
    {
        title_ua: 'Підсумки',
        url: '/summary',
        icon: () => <ChartLine />,
        visible: false,
        slug: 'summary',
    },
];

export const SOCIAL_GROUP: NavRoute[] = [
    {
        title_ua: 'Telegram',
        url: TELEGRAM_URL,
        icon: () => <BxBxlTelegram />,
        visible: true,
        slug: 'telegram',
    },
    {
        title_ua: 'Donatello',
        url: DONATELLO_URL,
        icon: () => <BxBxsDonateHeart />,
        visible: true,
        slug: 'donatello',
    },
];

export const APP_NAV_CONTENT: NavRoute[] = [...CONTENT_GROUP];

export const APP_NAV_USER_CONTENT: NavRoute[] = [...COMMUNITY_GROUP];

export const APP_NAV_MORE: { title_ua: string; items: NavRoute[] }[] = [
    {
        title_ua: 'Інше',
        items: [
            {
                title_ua: 'Календар',
                url: '/schedule',
                icon: () => <MaterialSymbolsCalendarClockRounded />,
                visible: true,
                slug: 'schedule',
            },
        ],
    },
    {
        title_ua: 'Модерація',
        items: MODERATION_GROUP,
    },
    {
        title_ua: 'Соцмережі',
        items: SOCIAL_GROUP,
    },
];

/** The mobile tab bar owns anime/manga/novel, so the sheet omits Контент. */
export const MOBILE_SHEET_NAV: { title_ua: string; items: NavRoute[] }[] = [
    {
        title_ua: 'Спільнота',
        items: COMMUNITY_GROUP,
    },
    {
        title_ua: 'Модерація',
        items: MODERATION_GROUP,
    },
    {
        title_ua: 'Інше',
        items: OTHER_GROUP,
    },
    {
        items: SOCIAL_GROUP,
        title_ua: 'Соцмережі',
    },
];

const NAV_URLS = [
    ...CONTENT_GROUP,
    ...COMMUNITY_GROUP,
    ...MODERATION_GROUP,
    ...OTHER_GROUP,
]
    .map((item) => item.url)
    .filter((url) => url.startsWith('/'));

function isUnder(pathname: string, url: string): boolean {
    if (url === '/') return pathname === '/';
    return pathname === url || pathname.startsWith(`${url}/`);
}

/**
 * A nav item owns the pathname only when no deeper item also claims it, so
 * `/edit/content` lights its own entry instead of that one and `/edit`.
 */
export function isNavActive(pathname: string, url: string): boolean {
    if (!isUnder(pathname, url)) return false;

    return !NAV_URLS.some(
        (candidate) =>
            candidate.length > url.length && isUnder(pathname, candidate),
    );
}

/** Catalog roots reachable from the mobile tab bar's Каталог tab. */
export const CATALOG_ROOT_LINKS = ['/anime', '/manga', '/novel'] as const;

export const PROFILE_MENU: NavRoute[] = [
    {
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.ANIME],
        title_ua: 'Список аніме',
        slug: 'anime-list',
        url: '/u/{username}/list/anime',
        search: { status: 'planned', sort: 'watch_score' },
    },
    {
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.MANGA],
        title_ua: 'Список манґи',
        slug: 'manga-list',
        url: '/u/{username}/list/manga',
        search: { status: 'planned', sort: 'read_score' },
    },
    {
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.NOVEL],
        title_ua: 'Список ранобе',
        slug: 'novel-list',
        url: '/u/{username}/list/novel',
        search: { status: 'planned', sort: 'read_score' },
    },
    {
        icon: MaterialSymbolsFavoriteRounded,
        title_ua: 'Улюблене',
        slug: 'favorite',
        url: '/u/{username}/favorites',
    },
    {
        icon: (props) => <MessageCircle {...props} fill="currentColor" />,
        title_ua: 'Коментарі',
        slug: 'comments',
        url: '/comments/user/{username}',
    },
    {
        icon: MaterialSymbolsSettingsOutlineRounded,
        title_ua: 'Налаштування',
        slug: 'settings',
        url: '/settings',
    },
];

export const FOOTER_LINKS = {
    rules: {
        title: 'Правила',
        href: '/articles/pravyla-saytu-9bcf83',
    },
    owners: {
        title: 'Правовласникам',
        href: '/articles/pravovlasnykam-a76512',
    },
} as const;

export const DONATION_LINKS = [
    {
        title: 'Donatello',
        href: DONATELLO_URL,
        icon: BxBxsDonateHeart,
    },
    {
        title: 'Монобанка',
        href: 'https://send.monobank.ua/jar/UejmZHk4B',
        icon: PhTipJarFill,
    },
] as const;

export const SOCIAL_LINKS = [
    {
        title: 'GitHub',
        href: 'https://github.com/hikka-io',
        icon: BxBxlGithub,
    },
    {
        title: 'Telegram',
        href: TELEGRAM_URL,
        icon: BxBxlTelegram,
    },
    {
        title: 'Mastadon',
        href: 'https://social.noleron.com/@hikka',
        icon: BxBxlMastadon,
    },
] as const;
