import '@fontsource-variable/geist';

import type { CSSProperties } from 'react';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
    Scripts,
    useRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { profileUiQueryKey, type UserCustomizationResponse } from '@hikka/api';

import NotFoundPage from '@/components/not-found-page';
import RouterProgressBar from '@/components/router-progress-bar';
import { Providers } from '@/features/app-shell';
import { UiPreferencesProvider } from '@/services/ui-preferences-store';
import {
    getThemeCookieFn,
    getUiPrefsCookieFn,
    refreshAuthCookieFn,
} from '@/utils/cookies';
import {
    backdropVars,
    DEFAULT_USER_UI,
    getUserStyles,
    STYLE_ELEMENT_ID,
    THEME_BOOTSTRAP_SCRIPT,
} from '@/utils/customization';
import { serializeJsonLd } from '@/utils/json-ld';
import { usePlausiblePageviews } from '@/utils/plausible';

import '../globals.css';
import type { RouterContext } from '../router';

export const Route = createRootRouteWithContext<RouterContext>()({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            {
                name: 'viewport',
                content:
                    'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
            },
            { name: 'color-scheme', content: 'dark light' },
            {
                name: 'keywords',
                content:
                    'аніме,аніме українською,мультфільми українською,дивитись аніме,аніме онлайн,anime,аніме романтика,аніме комедія,аніме школа,хіка,хікка,hikka,hikka.io,енциклопедія аніме,енциклопедія манги,енциклопедія ранобе,аніме каталог,аніме список,аніме жанри,жанри аніме,аніме персонажі,anime ukr,найкраще аніме,аніме портал,аніме культура,манга,манґа,манґа українською,ранобе,ранобе українською,аніме колекції, аніме статті',
            },
        ],
        links: [
            { rel: 'icon', href: '/favicon.ico' },
            { rel: 'apple-touch-icon', href: '/apple-icon.png' },
        ],
    }),
    loader: async ({ context }) => {
        // Rolling cookie: extend auth lifetime per SSR page request. Must stay
        // here (not createRouter) so it skips server routes like /auth/logout —
        // otherwise it re-sets the cookie logout is clearing. No-ops without an
        // auth cookie; server-only (client calls become RPCs).
        await refreshAuthCookieFn();

        const theme = await getThemeCookieFn();
        const uiPrefs = await getUiPrefsCookieFn();

        // Already prefetched in createRouter; read from cache, no extra call.
        const userUI =
            (context.queryClient.getQueryData(profileUiQueryKey()) as
                | UserCustomizationResponse
                | undefined) ?? DEFAULT_USER_UI;

        const { css: userStylesCSS, backdrop } = getUserStyles(userUI);
        return { userStylesCSS, theme, backdrop, uiPrefs };
    },
    component: RootLayout,
    notFoundComponent: NotFoundPage,
});

function RootLayout() {
    const { userStylesCSS, theme, backdrop, uiPrefs } = Route.useLoaderData();
    const router = useRouter();
    usePlausiblePageviews();

    return (
        <html
            lang="uk"
            suppressHydrationWarning
            data-backdrop={backdrop.style}
            style={backdropVars(backdrop) as CSSProperties}
        >
            <head>
                <script
                    // Also creates the theme-color meta: head() must not own
                    // it, or HeadContent reverts theme switches on client
                    // navigation.
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline theme script to prevent FOUC; contains no user input.
                    dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
                />
                <HeadContent />
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, escaped by serializeJsonLd.
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'Hikka',
                            url: 'https://hikka.io',
                            description:
                                'Українська онлайн енциклопедія аніме, манґи та ранобе',
                            inLanguage: 'uk',
                            potentialAction: {
                                '@type': 'SearchAction',
                                target: 'https://hikka.io/anime?search={search_term_string}',
                                'query-input':
                                    'required name=search_term_string',
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'Hikka',
                                url: 'https://hikka.io',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: 'https://hikka.io/logo-icon.png',
                                },
                            },
                        }),
                    }}
                />
                {userStylesCSS && (
                    <style
                        id={STYLE_ELEMENT_ID}
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: user's own saved custom CSS theme, applied intentionally.
                        dangerouslySetInnerHTML={{ __html: userStylesCSS }}
                    />
                )}
            </head>
            <body>
                <UiPreferencesProvider initial={uiPrefs}>
                    <Providers serverTheme={theme}>
                        <RouterProgressBar />
                        <Outlet />
                    </Providers>
                </UiPreferencesProvider>
                <TanStackDevtools
                    plugins={[
                        {
                            id: 'router',
                            name: 'TanStack Router',
                            render: (
                                <TanStackRouterDevtoolsPanel router={router} />
                            ),
                        },
                        {
                            id: 'query',
                            name: 'TanStack Query',
                            render: <ReactQueryDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}
