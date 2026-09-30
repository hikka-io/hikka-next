import { createFileRoute } from '@tanstack/react-router';

import { getCollectionOptions } from '@hikka/api';

import { CollectionEditorPage } from '@/features/collections';
import { retryOnCancel } from '@/utils/api/retry-on-cancel';
import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/$reference/update')({
    beforeLoad: async ({ params, context: { queryClient, apiClient } }) => {
        const collection = await retryOnCancel(() =>
            queryClient.ensureQueryData(
                getCollectionOptions({
                    path: { reference: params.reference },
                    client: apiClient,
                }),
            ),
        ).catch(() => undefined);

        requireOwner(
            queryClient,
            collection?.author?.username ?? '',
            `/collections/${params.reference}`,
        );
    },
    head: () =>
        generateHeadMeta({
            title: 'Редагувати колекцію',
            robots: { index: false },
        }),
    component: CollectionUpdatePage,
});

function CollectionUpdatePage() {
    const { reference } = Route.useParams();

    return <CollectionEditorPage reference={reference} />;
}
