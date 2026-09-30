import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { getClientByReferenceOptions } from '@hikka/api';

import {
    OAuthClient,
    OAuthConfirm,
    OAuthHeader,
    OAuthProfile,
} from '@/features/oauth';
import { generateHeadMeta } from '@/utils/metadata';
import { oauthSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/oauth')({
    staticData: { headerless: true },
    validateSearch: zodValidator(oauthSearchSchema),
    beforeLoad: ({ search: { reference, scope } }) => {
        if (!reference || !scope) throw redirect({ to: '/' });

        return { clientReference: reference };
    },
    loaderDeps: ({ search }) => search,
    loader: async ({
        context: { queryClient, apiClient, clientReference },
    }) => {
        await queryClient.prefetchQuery(
            getClientByReferenceOptions({
                path: { client_reference: clientReference },
                client: apiClient,
            }),
        );
    },
    head: () =>
        generateHeadMeta({
            title: 'OAuth',
            robots: { index: false },
        }),
    component: OAuthPage,
});

function OAuthPage() {
    return (
        <div className="mx-auto my-8 min-h-screen w-full max-w-xl px-4 lg:my-16">
            <div className="flex h-full flex-col items-center justify-start gap-8">
                <OAuthHeader />
                <OAuthProfile />
                <OAuthClient />
                <OAuthConfirm />
            </div>
        </div>
    );
}
