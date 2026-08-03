import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import {
    HikkaApiError,
    notificationsInfiniteOptions,
    profileOptions,
    unseenNotificationsCountOptions,
} from '@hikka/api';

import { Toaster } from '@/components/ui/sonner';
import {
    Footer,
    MobileHeader,
    MobileTabBar,
    Navbar,
    PageHeaderProvider,
} from '@/features/app-shell';
import { retryOnCancel } from '@/utils/api/retry-on-cancel';
import { getAuthTokenFn } from '@/utils/cookies';

export const Route = createFileRoute('/_pages')({
    beforeLoad: async ({ context: { queryClient, apiClient } }) => {
        if (!(await getAuthTokenFn())) return;

        try {
            const session = await retryOnCancel(() =>
                queryClient.ensureQueryData(
                    profileOptions({ client: apiClient }),
                ),
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
        <PageHeaderProvider>
            <Navbar />
            <MobileHeader />
            <main className="mx-auto mt-8 mb-8 w-full max-w-350 px-4 pt-[env(safe-area-inset-top)] lg:mt-16">
                <Outlet />
            </main>
            <Footer className="pb-[var(--tab-bar-height)]" />
            <MobileTabBar />
            <Toaster
                richColors
                position="bottom-right"
                // offset covers sonner's 600px-to-md window where the tab bar
                // still shows; the var is 0 at md+ so desktop stays at 2rem.
                offset={{ bottom: 'calc(var(--tab-bar-height) + 2rem)' }}
                mobileOffset={{
                    bottom: 'calc(var(--tab-bar-height) + 1rem)',
                    left: '1rem',
                    right: '1rem',
                }}
            />
        </PageHeaderProvider>
    );
}
