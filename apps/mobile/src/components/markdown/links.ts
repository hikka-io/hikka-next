import { SITE_ORIGIN } from '@/utils/site-origin';

const AUTH_ONLY_HOSTS = ['toloka.to', 'anitube.in.ua'];

const TRUSTED_HOSTS = [
    ...AUTH_ONLY_HOSTS,
    'watari-anime.com',
    'aniage.net',
    'myanimelist.net',
    'anilist.co',
    'mikai.me',
];

const ROUTE = /^\/(anime|manga|novel|characters|people|u)\/([^/?#]+)\/?$/;
const BARE_ROUTE = /^\/([^/?#]+)\/?$/;

// Profile subpages that exist in the app, with the one search param each of them reads.
const USER_SUBROUTE =
    /^\/u\/([^/?#]+)\/(history|favorites|list\/(?:anime|manga|novel))\/?$/;

const USER_SUBROUTE_PARAMS: Record<string, string> = {
    history: 'type',
    favorites: 'type',
    list: 'status',
};

// Routes that exist in the app; every other hikka.io link opens in the browser. Add a segment when its route lands.
const IN_APP_ROUTES = new Set([
    'anime',
    'manga',
    'novel',
    'characters',
    'people',
    'u',
]);

const BARE_ROUTES = new Set(['schedule']);

export type LinkTarget =
    | { kind: 'route'; href: string }
    | { kind: 'external'; url: string; trusted: boolean; authOnly: boolean }
    | { kind: 'none' };

const hostMatches = (hostname: string, hosts: string[]) =>
    hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));

const parseUrl = (href: string): URL | null => {
    try {
        return new URL(href, SITE_ORIGIN);
    } catch {
        return null;
    }
};

export const resolveLink = (href: string): LinkTarget => {
    const url = href.trim() ? parseUrl(href.trim()) : null;

    if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:')) {
        return { kind: 'none' };
    }

    const hostname = url.hostname.toLowerCase();

    if (hostname === 'hikka.io' || hostname.endsWith('.hikka.io')) {
        const match = ROUTE.exec(url.pathname);
        const subroute = USER_SUBROUTE.exec(url.pathname);

        if (subroute) {
            const param = USER_SUBROUTE_PARAMS[subroute[2].split('/')[0]];
            const value = url.searchParams.get(param);
            const query = value ? `?${param}=${encodeURIComponent(value)}` : '';

            return {
                kind: 'route',
                href: `/u/${subroute[1]}/${subroute[2]}${query}`,
            };
        }

        if (match && IN_APP_ROUTES.has(match[1])) {
            return { kind: 'route', href: `/${match[1]}/${match[2]}` };
        }

        const bare = BARE_ROUTE.exec(url.pathname)?.[1];

        if (bare && BARE_ROUTES.has(bare)) {
            return { kind: 'route', href: `/${bare}` };
        }

        return {
            kind: 'external',
            url: url.toString(),
            trusted: true,
            authOnly: false,
        };
    }

    return {
        kind: 'external',
        url: url.toString(),
        trusted: hostMatches(hostname, TRUSTED_HOSTS),
        authOnly: hostMatches(hostname, AUTH_ONLY_HOSTS),
    };
};

export const resolveImageUrl = (href: string): string | null => {
    const url = href.trim() ? parseUrl(href.trim()) : null;

    return url?.protocol === 'https:' ? url.toString() : null;
};
