import { createFileRoute } from '@tanstack/react-router';

import { CollectionEditorPage } from '@/features/collections';
import { requireAuth } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/new')({
    beforeLoad: async ({ context: { queryClient } }) => {
        requireAuth(queryClient);
    },
    head: () =>
        generateHeadMeta({
            title: 'Нова колекція / Колекції',
            robots: { index: false },
        }),
    component: CollectionNewPage,
});

function CollectionNewPage() {
    return <CollectionEditorPage />;
}
