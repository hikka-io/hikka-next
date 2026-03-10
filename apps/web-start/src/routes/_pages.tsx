import { sessionOptions } from '@hikka/react/options';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import {
    AppSidebar,
    Footer,
    Navbar,
    ScrollTop,
} from '@/features/common';
import { getCookie } from '@/utils/cookies/server';

export const Route = createFileRoute('/_pages')({
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        try {
            const authToken = await getCookie('auth');
            if (authToken) {
                hikkaClient.setAuthToken(authToken);
                await queryClient.prefetchQuery(sessionOptions(hikkaClient));
            }
        } catch {
            // getCookie or prefetch failed — continue unauthenticated
        }
    },
    component: PagesLayout,
});

function PagesLayout() {
    return (
        <SidebarProvider defaultOpen={false}>
            <ScrollTop />
            <div className="sticky top-0 z-50">
                <div className="container 2xl:max-w-360 relative mx-auto">
                    <AppSidebar />
                </div>
            </div>
            <Navbar />
            <main className="container 2xl:max-w-360 mx-auto mt-8 px-4 lg:mt-16">
                <Outlet />
            </main>
            <Footer />
            <Toaster richColors position="bottom-right" />
        </SidebarProvider>
    );
}
