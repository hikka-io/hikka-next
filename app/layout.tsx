import './globals.css';
import Providers from '@/utils/provider';
import { Inter } from 'next/font/google';
import NavBar from '@/app/layout/NavBar';
import Footer from '@/app/layout/Footer';
import AuthModal from '@/app/layout/AuthModal';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Hikka',
    description: 'Anime List',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html data-theme="synthwave" lang="en">
            <body className={inter.className}>
                <Providers>
                    <AuthModal />
                    <NavBar />
                    <main className="container max-w-screen-xl mx-auto px-4">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
