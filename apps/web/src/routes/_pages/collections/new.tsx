import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { collectionNewSearchSchema } from '@hikka/core';

import { CollectionEditorPage } from '@/features/collections';
import { loadCollectionNew } from '@/features/collections/queries';
import { requireAuth } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/new')({
    staticData: { immersive: true },
    validateSearch: zodValidator(collectionNewSearchSchema),
    beforeLoad: async ({ context: { queryClient } }) => {
        requireAuth(queryClient);
    },
    loaderDeps: ({ search }) => search,
    loader: ({ context, deps }) => loadCollectionNew(deps, context),
    head: () =>
        generateHeadMeta({
            title: 'Нова колекція / Колекції',
            robots: { index: false },
        }),
    component: CollectionNewPage,
});

function CollectionNewPage() {
    const initialContent = Route.useSearch();

    return <CollectionEditorPage initialContent={initialContent} />;
}
