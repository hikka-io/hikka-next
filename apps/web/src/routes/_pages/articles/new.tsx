import { createFileRoute } from '@tanstack/react-router';

import { ArticleEditorPage } from '@/features/articles';
import { requireAuth } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/articles/new')({
    beforeLoad: async ({ context: { queryClient } }) => {
        requireAuth(queryClient);
    },
    head: () =>
        generateHeadMeta({
            title: 'Нова стаття',
            robots: { index: false },
        }),
    component: ArticleNewPage,
});

function ArticleNewPage() {
    return <ArticleEditorPage />;
}
