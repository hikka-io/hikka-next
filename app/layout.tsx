import './globals.css';
import Providers from '@/utils/provider';
import { Inter } from 'next/font/google';
import Footer from '@/app/_layout/Footer';
import { ReactNode } from 'react';
import ScrollTop from '@/app/_layout/ScrollTop';
import AuthGate from '@/app/_layout/AuthGate';
import NavBar from '@/app/_layout/NavBar';
import NextTopLoader from 'nextjs-toploader';
import { Metadata } from 'next';
import MobileNavBar from '@/app/_layout/MobileNavBar';

const inter = Inter({ subsets: ['latin'] });

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

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="uk" data-theme="dark">
            <body className={inter.className}>
                <NextTopLoader color="#e779c1" />
                <Providers>
                    <AuthGate>
                        <ScrollTop />
                        <NavBar />
                        <div className="drawer drawer-end">
                            <input
                                id="mobileNavDrawer"
                                type="checkbox"
                                className="drawer-toggle"
                            />
                            <div className="drawer-content">
                                <main className="container max-w-screen-xl mx-auto px-4 md:mt-20 mt-8">
                                    {children}
                                </main>
                                <Footer />
                            </div>
                            <div className="drawer-side overflow-y-visible z-10 md:hidden">
                                <label
                                    htmlFor="mobileNavDrawer"
                                    aria-label="close sidebar"
                                    className="drawer-overlay"
                                ></label>
                                <MobileNavBar />
                            </div>
                        </div>
                    </AuthGate>
                </Providers>
            </body>
        </html>
    );
}
