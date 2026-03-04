import { FC, ReactNode } from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

import {
    AppSidebar,
    Footer,
    Navbar as NavBar,
    ScrollTop,
    SessionManager,
} from '@/features/common';

interface Props {
    children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
    return (
        <SessionManager>
            <SidebarProvider defaultOpen={false}>
                <ScrollTop />
                <div className="sticky top-0 z-50">
                    <div className="container relative mx-auto">
                        <AppSidebar />
                    </div>
                </div>
                <NavBar />
                <main className="container mx-auto mt-8 px-4">
                    {children}
                </main>
            </SidebarProvider>
            <Footer />
            <Toaster richColors position="bottom-right" />
        </SessionManager>
    );
};

export default Layout;
