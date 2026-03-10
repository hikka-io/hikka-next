import { commentListOptions } from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';

import { LatestComments } from '@/features/comments';

export const Route = createFileRoute('/_pages/comments/latest')({
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        await queryClient.prefetchInfiniteQuery(
            commentListOptions(hikkaClient),
        );
    },
    head: () => ({
        meta: [{ title: 'Останні коментарі / Hikka' }],
    }),
    component: LatestCommentsPage,
});

function LatestCommentsPage() {
    return (
        <div className="flex flex-col gap-12">
            <LatestComments />
        </div>
    );
}
