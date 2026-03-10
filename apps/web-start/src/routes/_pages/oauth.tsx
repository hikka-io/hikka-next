import { clientByReferenceOptions } from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { SessionManager } from '@/features/common';
import {
    OAuthClient as Client,
    OAuthConfirm as Confirm,
    OAuthHeader as Header,
    OAuthProfile as Profile,
} from '@/features/oauth';

export const Route = createFileRoute('/_pages/oauth')({
    loader: async ({
        context: { queryClient, hikkaClient },
        search,
    }) => {
        const { reference, scope } = search as {
            reference?: string;
            scope?: string;
        };

        if (!reference || !scope) throw redirect({ to: '/' });

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
        <SessionManager>
            <div className="w-full mx-auto my-8 min-h-screen max-w-xl px-4 lg:my-16">
                <div className="flex h-full flex-col items-center justify-start gap-8">
                    <Header />
                    <Profile />
                    <Client />
                    <Confirm />
                </div>
            </div>
        </SessionManager>
    );
}
