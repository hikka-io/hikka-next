import { createFileRoute } from '@tanstack/react-router';

import type { GetCollectionResponse } from '@hikka/api';
import { getCollectionQueryKey } from '@hikka/api';

import { CollectionEditorPage } from '@/features/collections';
import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/$reference/update')({
    beforeLoad: async ({ params, context: { queryClient } }) => {
        const collection = queryClient.getQueryData<GetCollectionResponse>(
            getCollectionQueryKey({ path: { reference: params.reference } }),
        );

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
