import NextTopLoader from 'nextjs-toploader';
import React, { ReactNode } from 'react';

import AuthGate from '@/app/_layout/AuthGate';
import AuthModal from '@/app/_layout/AuthModal';
import Footer from '@/app/_layout/Footer';
import MobileNavBar from '@/app/_layout/MobileNavBar';
import ScrollTop from '@/app/_layout/ScrollTop';
import SearchModal from '@/app/_layout/SearchModal';
import SettingsModal from '@/app/_layout/UserSettingsModal';
import NavBar from '@/app/_layout/navbar/NavBar';
import Providers from '@/utils/Providers';

// export const runtime = 'edge';

// export const runtime = 'edge';

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <NextTopLoader color="#e779c1" />
            <Providers>
                <AuthGate>
                    <SettingsModal />
                    <AuthModal />
                    <SearchModal />
                    <ScrollTop />
                    <NavBar />
                    <main className="container mx-auto mt-8 max-w-screen-xl px-4 lg:mt-20">
                        {children}
                    </main>
                    <div className="sticky bottom-4 mt-12 w-full">
                        <div
                            id="subbar"
                            className="container mx-auto max-w-screen-xl px-4"
                        />
                    </div>
                    <div
                        id="subbar-mobile"
                        className="no-scrollbar sticky bottom-0 z-10 mt-12 block w-full overflow-auto border-t border-t-secondary bg-base-100 md:hidden"
                    />
                    <Footer />
                </AuthGate>
            </Providers>
        </>
    );
}
