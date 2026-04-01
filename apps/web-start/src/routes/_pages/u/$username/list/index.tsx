import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/u/$username/list/')({
    loader: async ({ params }) => {
        throw redirect({
            to: '/u/$username/list/$content_type',
            params: {
                username: params.username,
                content_type: 'anime',
            },
            search: {
                status: 'completed',
                sort: 'watch_score',
            },
        });
    },
});
