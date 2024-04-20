import React, { ReactNode, Suspense } from 'react';

import AuthGate from '@/app/(pages)/components/auth-gate';
import Footer from '@/app/(pages)/components/footer';
import ModalManager from '@/app/(pages)/components/modal-manager';
import NavBar from '@/app/(pages)/components/navbar/navbar';
import ScrollTop from '@/app/(pages)/components/scroll-top';

export default async function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <AuthGate>
                <ScrollTop />
                <Suspense>
                    <ModalManager />
                </Suspense>
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
                    className="no-scrollbar sticky bottom-2 z-10 mb-2 mt-12 block w-full overflow-x-auto px-2 md:hidden"
                />
                <Footer />
            </AuthGate>
        </>
    );
}
