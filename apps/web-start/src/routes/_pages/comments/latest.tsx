import { prefetchInfiniteQuery } from '@hikka/react/core';
import { commentListOptions } from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';

import { LatestComments } from '@/features/comments';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/comments/latest')({
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        await prefetchInfiniteQuery(
            queryClient,
            commentListOptions(hikkaClient),
        );
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
    return (
        <div className="flex flex-col gap-12">
            <LatestComments />
        </div>
    );
}
