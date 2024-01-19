import NextTopLoader from 'nextjs-toploader';
import React, { ReactNode } from 'react';



import AuthGate from '@/app/_layout/auth-gate';
import AuthModal from '@/app/_layout/auth-modal';
import Footer from '@/app/_layout/footer';
import NavBar from '@/app/_layout/navbar/navbar';
import ScrollTop from '@/app/_layout/scroll-top';
import SearchModal from '@/app/_layout/search-modal';
import SettingsModal from '@/app/_layout/user-settings-modal';


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
                    className="no-scrollbar sticky bottom-2 mb-2 z-10 mt-12 block w-full overflow-auto bg-base-100 md:hidden"
                />
                <Footer />
            </AuthGate>
        </>
    );
}