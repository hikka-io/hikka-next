import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import {
    HikkaApiError,
    notificationsInfiniteOptions,
    profileOptions,
    unseenNotificationsCountOptions,
} from '@hikka/api';

import { Toaster } from '@/components/ui/sonner';
import { Footer, Navbar } from '@/features/app-shell';
import { getAuthTokenFn } from '@/utils/cookies';

export const Route = createFileRoute('/_pages')({
    beforeLoad: async ({ context: { queryClient, apiClient } }) => {
        if (!(await getAuthTokenFn())) return;

        try {
            const session = await queryClient.ensureQueryData(
                profileOptions({ client: apiClient }),
            );
            if (!session) throw redirect({ to: '/auth/logout' });
        } catch (error) {
            if (
                error instanceof HikkaApiError &&
                error.code === 'auth:invalid_token'
            ) {
                throw redirect({ to: '/auth/logout' });
            }
            throw error;
        }
    },
    loader: async ({ context: { queryClient, apiClient } }) => {
        if (!(await getAuthTokenFn())) return;

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData(
                notificationsInfiniteOptions({ client: apiClient }),
            ),
            queryClient.ensureQueryData(
                unseenNotificationsCountOptions({ client: apiClient }),
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
