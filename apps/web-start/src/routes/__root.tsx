import '@fontsource-variable/geist';
import 'react-photo-view/dist/react-photo-view.css';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRouteWithContext,
    useRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import NotFoundPage from '@/components/not-found-page';
import RouterProgressBar from '@/components/router-progress-bar';

import { Providers } from '@/features/common';

import { UIStoreProvider } from '@/services/providers/ui-store-provider';
import { refreshAuthCookieFn } from '@/utils/cookies';
import { STYLE_ELEMENT_ID } from '@/utils/ui';
import { getSessionUserUI, getUserStylesCSS } from '@/utils/ui/server';

import '../globals.css';
import { RouterContext } from '../router';

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
                    'онлайн перегляд аніме,аніме,аніме українською,мультфільми українською,дивитись аніме,аніме для дорослих,anime,аніме романтика,аніме комедія,аніме школа,хіка,хікка,hikka,hikka.io,хіка іо,енциклопедія аніме,енциклопедія манги,енциклопедія ранобе,анітуб,anitube,аніме жанри,онлайн на українській,жанри аніме,anime ukr,анітюб,Найкраще аніме,аніме портал,Аніме Портал,аніме культура,манга,манґа,ранобе,читати ранобе,читати мангу,читати манґу',
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
                src: '/js/script.js',
            },
        ],
    }),
    loader: async () => {
        // Rolling cookie: extend auth cookie lifetime on every SSR page request.
        // Must live here (not in createRouter) so it does NOT run for server routes
        // like /api/auth/logout — otherwise the refresh re-sets the cookie the
        // logout handler is trying to clear.
        // refreshAuthCookieFn is a createServerFn — it no-ops if no auth cookie exists
        // and only runs on the server (client calls become RPCs).
        await refreshAuthCookieFn();

        const userUI = await getSessionUserUI();
        const userStylesCSS = getUserStylesCSS(userUI);
        return { userUI, userStylesCSS };
    },
    component: RootLayout,
    notFoundComponent: NotFoundPage,
});

function RootLayout() {
    const { userUI, userStylesCSS } = Route.useLoaderData();
    const { hikkaClient } = Route.useRouteContext() as RouterContext;
    const router = useRouter();

    return (
        <html lang="uk" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}})();`,
                    }}
                />
                <HeadContent />
                <script
                    type="application/ld+json"
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
                        dangerouslySetInnerHTML={{ __html: userStylesCSS }}
                    />
                )}
            </head>
            <body>
                <div data-vaul-drawer-wrapper>
                    <UIStoreProvider initialUI={userUI}>
                        <Providers client={hikkaClient}>
                            <RouterProgressBar />
                            <Outlet />
                        </Providers>
                    </UIStoreProvider>
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
