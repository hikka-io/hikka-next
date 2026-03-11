import '@fontsource-variable/geist';
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import NotFoundPage from '@/components/not-found-page';
import { Providers } from '@/features/common';

import { UIStoreProvider } from '@/services/providers/ui-store-provider';
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
            { name: 'color-scheme', content: 'dark' },
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

    return (
        <html lang="uk" data-theme="dark" suppressHydrationWarning>
            <head>
                <HeadContent />
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
                            <Outlet />
                        </Providers>
                    </UIStoreProvider>
                </div>
                <TanStackRouterDevtools position="bottom-right" />
                <Scripts />
            </body>
        </html>
    );
}
