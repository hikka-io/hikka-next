import { resolveHttpsUrl, resolveWebUrl } from '@hikka/core';

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

const ROUTE = /^\/([a-z]+)(?:\/([^/?#]+))?\/?$/;

// Routes that exist in the app; every other hikka.io link opens in the browser. Add a segment when its route lands.
const IN_APP_ROUTES = new Set([
    'anime',
    'manga',
    'novel',
    'characters',
    'people',
    'u',
    'collections',
    'articles',
]);

// Segments whose list page (`/articles`, with its query) also exists in the app.
const IN_APP_INDEXES = new Set(['collections', 'articles']);

// `/articles/new` and `/collections/new` are the web editors.
const isEditor = (segment: string, slug: string) =>
    IN_APP_INDEXES.has(segment) && slug === 'new';

export type LinkTarget =
    | { kind: 'route'; href: string }
    | { kind: 'external'; url: string; trusted: boolean; authOnly: boolean }
    | { kind: 'none' };

const hostMatches = (hostname: string, hosts: string[]) =>
    hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));

export const resolveLink = (href: string): LinkTarget => {
    const url = resolveWebUrl(href, SITE_ORIGIN);

    if (!url) return { kind: 'none' };

    const hostname = url.hostname.toLowerCase();

    if (hostname === 'hikka.io' || hostname.endsWith('.hikka.io')) {
        const match = ROUTE.exec(url.pathname);

        if (match && IN_APP_ROUTES.has(match[1])) {
            if (match[2] && !isEditor(match[1], match[2])) {
                return { kind: 'route', href: `/${match[1]}/${match[2]}` };
            }
            if (!match[2] && IN_APP_INDEXES.has(match[1])) {
                return { kind: 'route', href: `/${match[1]}${url.search}` };
            }
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

export const resolveImageUrl = (href: string): string | null =>
    resolveHttpsUrl(href, SITE_ORIGIN)?.toString() ?? null;
