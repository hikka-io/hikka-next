import { queryKeys } from '@hikka/react/core';
import { sessionOptions } from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

import { AppSidebar, Footer, Navbar, ScrollTop } from '@/features/common';

export const Route = createFileRoute('/_pages')({
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        const authToken = hikkaClient.getAuthToken();
        if (!authToken) return;

        await queryClient.prefetchQuery(sessionOptions(hikkaClient));

        // Check if session prefetch stored an invalid token error
        const sessionState = queryClient.getQueryState(queryKeys.user.me());
        if (
            sessionState?.error &&
            typeof sessionState.error === 'object' &&
            'code' in sessionState.error &&
            (sessionState.error as any).code === 'auth:invalid_token'
        ) {
            throw redirect({ to: '/api/auth/logout' });
        }
    },
    component: PagesLayout,
});

function PagesLayout() {
    return (
        <SidebarProvider defaultOpen={false}>
            <ScrollTop />
            <div className="sticky top-0 z-50">
                <div className="relative mx-auto w-full max-w-350">
                    <AppSidebar />
                </div>
            </div>
            <Navbar />
            <main className="mx-auto mt-8 w-full max-w-350 px-4 lg:mt-16">
                <Outlet />
            </main>
            <Footer />
            <Toaster richColors position="bottom-right" />
        </SidebarProvider>
    );
}
