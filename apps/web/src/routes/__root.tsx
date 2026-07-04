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
import { getThemeCookieFn, refreshAuthCookieFn } from '@/utils/cookies';
import { backdropVars, DEFAULT_USER_UI, STYLE_ELEMENT_ID } from '@/utils/ui';
import { getUserStyles } from '@/utils/ui/server';

import '../globals.css';
import type { RouterContext } from '../router';

export const Route = createRootRouteWithContext<RouterContext>()({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, maximum-scale=1',
            },
            { name: 'theme-color', content: 'black' },
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
        scripts: [
            {
                defer: true,
                'data-domain': 'hikka.io',
                src: '/js/plausible.local.js',
            },
        ],
    }),
    loader: async ({ context }) => {
        // Rolling cookie: extend auth lifetime per SSR page request. Must stay
        // here (not createRouter) so it skips server routes like /auth/logout —
        // otherwise it re-sets the cookie logout is clearing. No-ops without an
        // auth cookie; server-only (client calls become RPCs).
        await refreshAuthCookieFn();

        const theme = await getThemeCookieFn();

        // Already prefetched in createRouter; read from cache, no extra call.
        const userUI =
            (context.queryClient.getQueryData(profileUiQueryKey()) as
                | UserCustomizationResponse
                | undefined) ?? DEFAULT_USER_UI;

        const { css: userStylesCSS, backdrop } = getUserStyles(userUI);
        return { userStylesCSS, theme, backdrop };
    },
    component: RootLayout,
    notFoundComponent: NotFoundPage,
});

function RootLayout() {
    const { userStylesCSS, theme, backdrop } = Route.useLoaderData();
    const router = useRouter();

    return (
        <html
            lang="uk"
            suppressHydrationWarning
            data-backdrop={backdrop.style}
            style={backdropVars(backdrop) as CSSProperties}
        >
            <head>
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline theme script to prevent FOUC; contains no user input.
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var c=document.cookie.match(/(?:^|;\\s*)theme=([^;]*)/);var t=c?decodeURIComponent(c[1]):'dark';if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}})();`,
                    }}
                />
                <HeadContent />
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data, no user input.
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
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
                <div data-vaul-drawer-wrapper>
                    <Providers serverTheme={theme}>
                        <RouterProgressBar />
                        <Outlet />
                    </Providers>
                </div>
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
