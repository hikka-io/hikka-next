import { FC, ReactNode, Suspense } from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

import Footer from '@/features/common/footer.component';
import NavBar from '@/features/common/navbar/navbar.component';
import ScrollTop from '@/features/common/scroll-top.component';
import SessionManager from '@/features/common/session-manager.component';

import SnowfallManager from '../../components/snowfall-manager';

interface Props {
    children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
    return (
        <SessionManager>
            <SidebarProvider defaultOpen={false}>
                <ScrollTop />
                <NavBar />

                <main className="container mx-auto mt-8 max-w-screen-xl px-4 lg:mt-16">
                    <Suspense>
                        <SnowfallManager />
                    </Suspense>
                    {children}
                </main>
            </SidebarProvider>
            <div className="sticky bottom-4 mt-12 w-full">
                <div id="subbar" className="container mx-auto  px-4" />
            </div>
            <div
                id="subbar-mobile"
                className="no-scrollbar sticky bottom-2 z-10 mb-2 mt-12 block w-full max-w-screen-xl overflow-x-auto px-2 md:hidden"
            />
            <Footer />
            <Toaster richColors position="bottom-right" />
        </SessionManager>
    );
};

export default Layout;
