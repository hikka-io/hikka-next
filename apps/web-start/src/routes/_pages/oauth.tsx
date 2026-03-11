import { clientByReferenceOptions } from '@hikka/react/options';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute, redirect } from '@tanstack/react-router';

import {
    OAuthClient as Client,
    OAuthConfirm as Confirm,
    OAuthHeader as Header,
    OAuthProfile as Profile,
} from '@/features/oauth';
import { oauthSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/oauth')({
    validateSearch: zodValidator(oauthSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({
        context: { queryClient, hikkaClient },
        deps,
    }) => {
        const { reference, scope } = deps;

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
