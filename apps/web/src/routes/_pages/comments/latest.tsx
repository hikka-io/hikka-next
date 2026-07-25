import { createFileRoute } from '@tanstack/react-router';

import { commentsListInfiniteOptions, paginationPageParam } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import { LatestComments } from '@/features/comments';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/comments/latest')({
    loader: async ({ context: { queryClient, apiClient } }) => {
        await queryClient.prefetchInfiniteQuery({
            ...commentsListInfiniteOptions({ client: apiClient }),
            ...paginationPageParam(),
        });
    },
    head: () =>
        generateHeadMeta({
            title: 'Останні коментарі',
            description: 'Останні коментарі спільноти на Hikka',
            url: 'https://hikka.io/comments/latest',
        }),
    component: LatestCommentsPage,
});

function LatestCommentsPage() {
    usePageHeader({ title: 'Останні коментарі', parent: '/', anchored: true });

    return (
        <div className="flex flex-col gap-12">
            <LatestComments />
        </div>
    );
}
