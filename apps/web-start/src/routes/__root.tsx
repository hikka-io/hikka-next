import '@fontsource-variable/geist';
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRouteWithContext,
} from '@tanstack/react-router';

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
        ],
        scripts: [
            {
                defer: true,
                'data-domain': 'hikka.io',
                src: 'https://plausible.hikka.io/js/script.js',
            },
        ],
    }),
    loader: async () => {
        const userUI = await getSessionUserUI();
        const userStylesCSS = getUserStylesCSS(userUI);
        return { userUI, userStylesCSS };
    },
    component: RootLayout,
});

function RootLayout() {
    const { userUI, userStylesCSS } = Route.useLoaderData();
    const { queryClient, hikkaClient } =
        Route.useRouteContext() as RouterContext;

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
                        <Providers
                            client={hikkaClient}
                            queryClient={queryClient}
                        >
                            <Outlet />
                        </Providers>
                    </UIStoreProvider>
                </div>
                <Scripts />
            </body>
        </html>
    );
}
