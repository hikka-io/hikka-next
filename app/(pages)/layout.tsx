import Providers from '@/utils/Providers';
import Footer from '@/app/_layout/Footer';
import React, {ReactNode} from 'react';
import ScrollTop from '@/app/_layout/ScrollTop';
import AuthGate from '@/app/_layout/AuthGate';
import NextTopLoader from 'nextjs-toploader';
import MobileNavBar from '@/app/_layout/MobileNavBar';
import AuthModal from '@/app/_layout/AuthModal';
import SearchModal from '@/app/_layout/SearchModal';
import NavBar from '@/app/_layout/navbar/NavBar';
import SettingsModal from "@/app/_layout/UserSettingsModal"; // export const runtime = 'edge';

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
                    <main className="container max-w-screen-xl mx-auto px-4 lg:mt-20 mt-8">
                        {children}
                    </main>
                    <div className="sticky mt-12 bottom-4 w-full">
                        <div
                            id="subbar"
                            className="container mx-auto max-w-screen-xl px-4"
                        />
                    </div>
                    <div
                        id="subbar-mobile"
                        className="no-scrollbar z-10 mt-12 md:hidden block w-full sticky bottom-0 overflow-auto bg-base-100 border-t border-t-secondary"
                    />
                    <Footer />
                </AuthGate>
            </Providers>
        </>
    );
}
