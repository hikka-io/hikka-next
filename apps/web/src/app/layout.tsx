import { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import { Geist } from 'next/font/google';
import { ReactNode } from 'react';
import 'react-photo-view/dist/react-photo-view.css';

import { Providers } from '@/features/common';

import { UIStoreProvider } from '@/services/providers/ui-store-provider';
import { generateMetadata } from '@/utils/metadata';
import { STYLE_ELEMENT_ID } from '@/utils/ui';
import { getSessionUserUI, getUserStylesCSS } from '@/utils/ui/server';

import { TailwindIndicator } from '../components/tailwind-indicator';
import './globals.css';

const geist = Geist({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
    variable: '--font-geist',
});

export const metadata: Metadata = {
    ...generateMetadata(),
    keywords: [
        'онлайн перегляд аніме',
        'аніме',
        'аніме українською',
        'мультфільми українською',
        'дивитись аніме',
        'аніме для дорослих',
        'anime',
        'аніме романтика',
        'аніме комедія',
        'аніме школа',
        'хіка',
        'хікка',
        'hikka',
        'hikka.io',
        'хіка іо',
        'енциклопедія аніме',
        'енциклопедія манги',
        'енциклопедія ранобе',
        'анітуб',
        'anitube',
        'аніме жанри',
        'онлайн на українській',
        'жанри аніме',
        'anime ukr',
        'анітюб',
        'Найкраще аніме',
        'аніме портал',
        'Аніме Портал',
        'аніме культура',
        'манга',
        'манґа',
        'ранобе',
        'читати ранобе',
        'читати мангу',
        'читати манґу',
    ],
    metadataBase: new URL('https://hikka.io'),
};

export const viewport: Viewport = {
    colorScheme: 'dark',
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

interface Props {
    children: ReactNode;
}

const RootLayout = async ({ children }: Props) => {
    const UI = await getSessionUserUI();
    const userStylesCSS = await getUserStylesCSS(UI);

    return (
        <html
            className={`${geist.variable}`}
            lang="uk"
            data-theme="dark"
            suppressHydrationWarning
        >
            <head>
                <PlausibleProvider
                    trackLocalhost
                    enabled
                    selfHosted
                    customDomain="https://hikka.io"
                    domain="hikka.io"
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
                    <UIStoreProvider initialUI={UI}>
                        <Providers>{children}</Providers>
                    </UIStoreProvider>
                </div>
                <TailwindIndicator />
            </body>
        </html>
    );
};

export default RootLayout;
