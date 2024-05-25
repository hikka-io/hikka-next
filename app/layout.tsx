import '@mdxeditor/editor/style.css';
import { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { ReactNode } from 'react';

import { TailwindIndicator } from '@/components/tailwind-indicator';

import Providers from '@/features/common/providers.component';

import generateMetadata from '@/utils/generate-metadata';

import './globals.css';

const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
    variable: '--font-inter',
});

const fixelDisplay = localFont({
    src: '../fonts/FixelDisplay-SemiBold.woff2',
    display: 'swap',
    variable: '--font-fixel-display',
});

export const metadata: Metadata = {
    ...generateMetadata({}),
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

const RootLayout = ({ children }: Props) => {
    return (
        <html
            className={`${inter.variable} ${fixelDisplay.variable}`}
            lang="uk"
            data-theme="dark"
            suppressHydrationWarning
        >
            <head>
                <PlausibleProvider
                    trackLocalhost
                    enabled
                    selfHosted
                    customDomain=""
                    domain="hikka.io"
                />
            </head>
            <body>
                <Providers>{children}</Providers>
                <TailwindIndicator />
            </body>
        </html>
    );
};

export default RootLayout;
