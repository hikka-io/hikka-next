import { HikkaApiError } from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import {
    notificationListOptions,
    sessionOptions,
    unseenNotificationsCountOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { Toaster } from '@/components/ui/sonner';

import { Footer, Navbar } from '@/features/common';

export const Route = createFileRoute('/_pages')({
    beforeLoad: async ({ context: { queryClient, hikkaClient } }) => {
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
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        if (!hikkaClient.getAuthToken()) return;

        await Promise.allSettled([
            prefetchInfiniteQuery(
                queryClient,
                notificationListOptions(hikkaClient),
            ),
            queryClient.prefetchQuery(
                unseenNotificationsCountOptions(hikkaClient),
            ),
        ]);
    },
    component: PagesLayout,
});

function PagesLayout() {
    return (
        <>
            <Navbar />
            <main className="mx-auto mt-8 mb-8 w-full max-w-350 px-4 lg:mt-16">
                <Outlet />
            </main>
            <Footer />
            <Toaster richColors position="bottom-right" />
        </>
    );
}
