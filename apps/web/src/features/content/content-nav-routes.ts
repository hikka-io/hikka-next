import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { contentPath } from '@/utils/content-paths';
import type { NavRoute } from '@/utils/navigation';

export type NavContentType =
    | MainContentTypeEnum
    | typeof ContentTypeEnum.CHARACTER
    | typeof ContentTypeEnum.PERSON;

const GENERAL: NavRoute = { slug: 'general', title_ua: 'Загальне', url: '' };
const CHARACTERS: NavRoute = {
    slug: 'characters',
    title_ua: 'Персонажі',
    url: '/characters',
};
const FRANCHISE: NavRoute = {
    slug: 'franchise',
    title_ua: 'Франшиза',
    url: '/franchise',
};
const STAFF: NavRoute = { slug: 'staff', title_ua: 'Автори', url: '/staff' };
const ANIME: NavRoute = { slug: 'anime', title_ua: 'Аніме', url: '/anime' };
const MANGA: NavRoute = { slug: 'manga', title_ua: 'Манґа', url: '/manga' };
const NOVEL: NavRoute = { slug: 'novel', title_ua: 'Ранобе', url: '/novel' };

const READ_NAV_ROUTES = [GENERAL, CHARACTERS, FRANCHISE, STAFF];

const CONTENT_NAV_ROUTES = {
    [ContentTypeEnum.ANIME]: [
        GENERAL,
        CHARACTERS,
        FRANCHISE,
        { slug: 'media', title_ua: 'Медіа', url: '/media' },
        STAFF,
    ],
    [ContentTypeEnum.MANGA]: READ_NAV_ROUTES,
    [ContentTypeEnum.NOVEL]: READ_NAV_ROUTES,
    [ContentTypeEnum.CHARACTER]: [
        GENERAL,
        { slug: 'voices', title_ua: 'Сейю', url: '/voices' },
        ANIME,
        MANGA,
        NOVEL,
    ],
    [ContentTypeEnum.PERSON]: [GENERAL, ANIME, MANGA, NOVEL, CHARACTERS],
} satisfies Record<NavContentType, NavRoute[]>;

export const hasContentNav = (type: string): type is NavContentType =>
    Object.hasOwn(CONTENT_NAV_ROUTES, type);

/** Absolute section links for a content page, its comments page included. */
export function contentNavRoutes(
    type: NavContentType,
    slug: string,
): NavRoute[] {
    const base = contentPath(type, slug);

    return [
        ...CONTENT_NAV_ROUTES[type].map((route) => ({
            ...route,
            url: `${base}${route.url}`,
        })),
        {
            slug: 'comments',
            title_ua: 'Обговорення',
            url: `/comments/${type}/${slug}`,
        },
    ];
}
