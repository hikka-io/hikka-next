import { HikkaApiError } from '@hikka/client';
import { sessionOptions } from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

import { AppSidebar, Footer, Navbar, ScrollTop } from '@/features/common';

export const Route = createFileRoute('/_pages')({
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        const authToken = hikkaClient.getAuthToken();
        if (!authToken) return;

        try {
            const session = await queryClient.ensureQueryData(
                sessionOptions(hikkaClient),
            );
            if (!session) throw redirect({ to: '/api/auth/logout' });
        } catch (error) {
            if (
                error instanceof HikkaApiError &&
                error.code === 'auth:invalid_token'
            ) {
                throw redirect({ to: '/api/auth/logout' });
            }
            throw error;
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
