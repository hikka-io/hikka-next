import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

import { userReferenceOptions } from '@hikka/api';

import { ensureOr404 } from '@/utils/api/ensure-or-404';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute('/r/$reference')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { reference } = params;

        if (!UUID_RE.test(reference)) throw notFound();

        const user = await ensureOr404(
            queryClient.ensureQueryData(
                userReferenceOptions({
                    path: { reference },
                    client: apiClient,
                }),
            ),
        );

        throw redirect({
            to: '/u/$username',
            params: { username: user.username },
        });
    },
});