import { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import { Geist } from 'next/font/google';
import { ReactNode } from 'react';
import 'react-photo-view/dist/react-photo-view.css';

import Providers from '@/features/common/providers.component';

import generateMetadata from '@/utils/generate-metadata';

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

const RootLayout = ({ children }: Props) => {
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
            </head>
            <body>
                <div data-vaul-drawer-wrapper>
                    <Providers>{children}</Providers>
                </div>
                <TailwindIndicator />
            </body>
        </html>
    );
};

export default RootLayout;
