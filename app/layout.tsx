import './globals.css';
import {Inter} from 'next/font/google';
import localFont from 'next/font/local';
import React, {ReactNode} from 'react';
import {Metadata, Viewport} from 'next';

// export const runtime = 'edge';

const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
    variable: '--font-inter',
});

const fixelDisplay = localFont({
    src: '../fonts/FixelDisplay-Bold.woff2',
    display: 'swap',
    variable: '--font-fixel-display',
});

/*const fixelText = localFont({
    src: [
        {
            path: '../fonts/FixelText-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../fonts/FixelText-SemiBold.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../fonts/FixelText-Bold.woff2',
            weight: '600',
            style: 'normal',
        },
    ],
    display: 'swap',
    variable: '--font-fixel-text',
});*/

export const metadata: Metadata = {
    title: {
        default: 'Hikka - енциклопедія аніме українською',
        template: '%s / Hikka',
    },
    description:
        'Hikka - українська онлайн енциклопедія аніме. Весь список аніме, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого, кастомізуй профіль та ділись з друзями.',
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
    openGraph: {
        images: '/preview.jpg',
        title: {
            default: 'Hikka - енциклопедія аніме українською',
            template: '%s / Hikka',
        },
        description:
            'Hikka - українська онлайн енциклопедія аніме. Весь список аніме, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого, кастомізуй профіль та ділись з друзями.',
    },
    twitter: {
        images: '/preview.jpg',
        title: {
            default: 'Hikka - енциклопедія аніме українською',
            template: '%s / Hikka',
        },
        description:
            'Hikka - українська онлайн енциклопедія аніме. Весь список аніме, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого, кастомізуй профіль та ділись з друзями.',
    },
    metadataBase: new URL('https://hikka.io'),
};

export const viewport: Viewport = {
    colorScheme: 'dark',
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html
            className={`${inter.variable} ${fixelDisplay.variable}`}
            lang="uk"
            data-theme="dark"
        >
            <body>{children}</body>
        </html>
    );
}
