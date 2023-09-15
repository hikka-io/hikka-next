import './globals.css';
import Providers from '@/utils/provider';
import { Inter } from 'next/font/google';
import NavBar from '@/app/layout/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Hikka',
    description: 'Anime List',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html data-theme="synthwave" lang="en">
            <body className={inter.className}>
                <Providers>
                    <header>
                        <NavBar />
                    </header>
                    <main className="container max-w-screen-xl mx-auto px-4">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
