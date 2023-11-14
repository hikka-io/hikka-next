import './globals.css';
import Providers from '@/utils/provider';
import { Inter } from 'next/font/google';
import Footer from '@/app/_layout/Footer';
import { ReactNode } from 'react';
import ScrollTop from '@/app/_layout/ScrollTop';
import AuthGate from '@/app/_layout/AuthGate';
import NavBar from '@/app/_layout/NavBar';
/*import dynamic from 'next/dynamic';

const NavBar = dynamic(() => import('@/app/_layout/NavBar'), {
    ssr: false,
});*/

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Hikka',
    description: 'Anime List',
};

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <AuthGate>
                        <ScrollTop />
                        <NavBar />
                        <main className="container max-w-screen-xl mx-auto px-4 md:mt-24 mt-8">
                            {children}
                        </main>
                        <Footer />
                    </AuthGate>
                </Providers>
            </body>
        </html>
    );
}
