import { clientByReferenceOptions } from '@hikka/react/options';
import { queryKeys } from '@hikka/react/core';
import { createFileRoute, redirect } from '@tanstack/react-router';

import {
    OAuthClient as Client,
    OAuthConfirm as Confirm,
    OAuthHeader as Header,
    OAuthProfile as Profile,
} from '@/features/oauth';

export const Route = createFileRoute('/_pages/oauth')({
    validateSearch: (search: Record<string, unknown>) =>
        search as Record<string, any>,
    loader: async ({
        context: { queryClient, hikkaClient },
        location,
    }) => {
        const { reference, scope } = location.search as {
            reference?: string;
            scope?: string;
        };

        if (!reference || !scope) throw redirect({ to: '/' });

        // Check if session has invalid token error (parent _pages loader prefetched it)
        const sessionState = queryClient.getQueryState(queryKeys.user.me());
        if (
            sessionState?.error &&
            typeof sessionState.error === 'object' &&
            'code' in sessionState.error &&
            (sessionState.error as any).code === 'auth:invalid_token'
        ) {
            throw redirect({ to: '/api/auth/logout' });
        }

        await queryClient.prefetchQuery(
            clientByReferenceOptions(hikkaClient, { reference }),
        );
    },
    head: () => ({
        meta: [{ title: 'OAuth / Hikka' }],
    }),
    component: OAuthPage,
});

function OAuthPage() {
    return (
        <div className="w-full mx-auto my-8 min-h-screen max-w-xl px-4 lg:my-16">
            <div className="flex h-full flex-col items-center justify-start gap-8">
                <Header />
                <Profile />
                <Client />
                <Confirm />
            </div>
        </div>
    );
}
