import HolyLoader from 'holy-loader';
import React, { ReactNode } from 'react';

import AuthGate from '@/components/auth-gate';
import Footer from '@/components/footer';
import NavBar from '@/components/navbar/navbar';
import ScrollTop from '@/components/scroll-top';

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <HolyLoader color="#e779c1" />
            <AuthGate>
                <ScrollTop />
                <NavBar />

                <main className="container mx-auto mt-8 max-w-screen-xl px-4 lg:mt-16">
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
                    className="no-scrollbar bg-base-100 sticky bottom-2 z-10 mb-2 mt-12 block w-full overflow-auto px-2 md:hidden"
                />
                <Footer />
            </AuthGate>
        </>
    );
}
