import { ContentTypeEnum } from '@hikka/client';
import { FilePenLine, UsersIcon } from 'lucide-react';

import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import MaterialSymbolsLoginRounded from '@/components/icons/material-symbols/MaterialSymbolsLoginRounded';
import MaterialSymbolsPersonAddOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddOutlineRounded';

import BxBxlTelegram from '../../components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '../../components/icons/bx/BxBxsDonateHeart';
import IconamoonCommentFill from '../../components/icons/iconamoon/IconamoonCommentFill';
import MaterialSymbolsAnimatedImages from '../../components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsCalendarClockRounded from '../../components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsCustomTypographyRounded from '../../components/icons/material-symbols/MaterialSymbolsCustomTypographyRounded';
import MaterialSymbolsDynamicFeedRounded from '../../components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsEditRounded from '../../components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsEventListRounded from '../../components/icons/material-symbols/MaterialSymbolsEventListRounded';
import MaterialSymbolsFace3 from '../../components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsHomeRounded from '../../components/icons/material-symbols/MaterialSymbolsHomeRounded';
import MaterialSymbolsLockOpenRounded from '../../components/icons/material-symbols/MaterialSymbolsLockOpenRounded';
import MaterialSymbolsMenuBookRounded from '../../components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsNotificationsActiveRounded from '../../components/icons/material-symbols/MaterialSymbolsNotificationsActiveRounded';
import MaterialSymbolsPalette from '../../components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '../../components/icons/material-symbols/MaterialSymbolsPerson';
import MaterialSymbolsSettingsOutlineRounded from '../../components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import MaterialSymbolsStack from '../../components/icons/material-symbols/MaterialSymbolsStack';
import MdiPuzzle from '../../components/icons/mdi/MdiPuzzle';
import { ARTICLE_CATEGORY_OPTIONS } from './common';

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
    {
        slug: 'franchise',
        title_ua: "Пов'язане",
        url: '/franchise',
    },
    {
        slug: 'staff',
        title_ua: 'Автори',
        url: '/staff',
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
    {
        slug: 'franchise',
        title_ua: "Пов'язане",
        url: '/franchise',
    },
    {
        slug: 'staff',
        title_ua: 'Автори',
        url: '/staff',
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

const CONTENT_GROUP: Hikka.NavRoute[] = [
    {
        title_ua: 'Аніме',
        url: '/anime',
        icon: () => <MaterialSymbolsAnimatedImages />,
        visible: true,
        slug: 'anime',
    },
    {
        title_ua: 'Манґа',
        url: '/manga',
        icon: () => <MaterialSymbolsPalette />,
        visible: true,
        slug: 'manga',
    },
    {
        title_ua: 'Ранобе',
        url: '/novel',
        icon: () => <MaterialSymbolsMenuBookRounded />,
        visible: true,
        slug: 'novel',
    },
];

const COMMUNITY_GROUP: Hikka.NavRoute[] = [
    {
        title_ua: 'Статті',
        url: '/articles',
        icon: () => <MaterialSymbolsDynamicFeedRounded />,
        visible: true,
        items: (
            Object.keys(ARTICLE_CATEGORY_OPTIONS) as Array<
                keyof typeof ARTICLE_CATEGORY_OPTIONS
            >
        )
            .filter((category) => !ARTICLE_CATEGORY_OPTIONS[category].admin)
            .map((category) => ({
                title_ua: ARTICLE_CATEGORY_OPTIONS[category].title_ua,
                url: `/articles/?categories=${category}`,
                visible: true,
                icon: ARTICLE_CATEGORY_OPTIONS[category].icon,
                slug: `articles/${category}`,
            })),
        slug: 'articles',
    },
    {
        title_ua: 'Колекції',
        url: '/collections',
        icon: () => <MaterialSymbolsStack />,
        visible: true,
        slug: 'collections',
    },
];

const MODERATION_GROUP: Hikka.NavRoute[] = [
    {
        title_ua: 'Правки',
        url: '/edit',
        icon: () => <MaterialSymbolsEditRounded />,
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

const OTHER_GROUP: Hikka.NavRoute[] = [
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
        icon: () => <MaterialSymbolsFace3 />,
        visible: false,
        slug: 'characters',
    },
    {
        title_ua: 'Люди',
        url: '/people',
        icon: () => <MaterialSymbolsPerson />,
        visible: false,
        slug: 'people',
    },
    {
        title_ua: 'Коментарі',
        url: '/comments',
        icon: () => <IconamoonCommentFill />,
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
];

const SOCIAL_GROUP: Hikka.NavRoute[] = [
    {
        title_ua: 'Telegram',
        url: 'https://t.me/hikka_io',
        icon: () => <BxBxlTelegram />,
        visible: true,
        slug: 'telegram',
    },
    {
        title_ua: 'Donatello',
        url: 'https://donatello.to/hikka.io',
        icon: () => <BxBxsDonateHeart />,
        visible: true,
        slug: 'donatello',
    },
];

export const APP_SIDEBAR: { title_ua: string; items: Hikka.NavRoute[] }[] = [
    {
        title_ua: 'Контент',
        items: CONTENT_GROUP,
    },
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

export const CONTENT_TYPE_LINKS: Record<ContentTypeEnum, string> = {
    [ContentTypeEnum.PERSON]: '/people',
    [ContentTypeEnum.CHARACTER]: '/characters',
    [ContentTypeEnum.ANIME]: '/anime',
    [ContentTypeEnum.EDIT]: '/edit',
    [ContentTypeEnum.COMMENT]: '/comments',
    [ContentTypeEnum.COLLECTION]: '/collections',
    [ContentTypeEnum.MANGA]: '/manga',
    [ContentTypeEnum.NOVEL]: '/novel',
    [ContentTypeEnum.ARTICLE]: '/articles',
    [ContentTypeEnum.USER]: '/u',
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

const PROFILE_GENERAL_GROUP: Hikka.NavRoute[] = [
    {
        icon: MaterialSymbolsPerson,
        title_ua: 'Профіль',
        slug: 'profile',
        url: '/u/{username}',
    },
    {
        icon: MaterialSymbolsFavoriteRounded,
        title_ua: 'Улюблене',
        slug: 'favorite',
        url: '/u/{username}/favorites',
    },
];

const PROFILE_LISTS_GROUP: Hikka.NavRoute[] = [
    {
        icon: MaterialSymbolsAnimatedImages,
        title_ua: 'Список аніме',
        slug: 'anime',
        url: '/u/{username}/list/anime?status=planned&sort=watch_score',
    },
    {
        icon: MaterialSymbolsPalette,
        title_ua: 'Список манґи',
        slug: 'manga',
        url: '/u/{username}/list/manga?status=planned&sort=read_score',
    },
    {
        icon: MaterialSymbolsMenuBookRounded,
        title_ua: 'Список ранобе',
        slug: 'novel',
        url: '/u/{username}/list/novel?status=planned&sort=read_score',
    },
];

const PROFILE_OTHER_GROUP: Hikka.NavRoute[] = [
    {
        icon: MaterialSymbolsMenuBookRounded,
        title_ua: 'Налаштування',
        slug: 'settings',
        url: '/settings',
    },
];

export const PROFILE_MENU: { title_ua: string; items: Hikka.NavRoute[] }[] = [
    {
        title_ua: 'Загальне',
        items: PROFILE_GENERAL_GROUP,
    },
    {
        title_ua: 'Списки',
        items: PROFILE_LISTS_GROUP,
    },
    {
        title_ua: 'Інше',
        items: PROFILE_OTHER_GROUP,
    },
];
