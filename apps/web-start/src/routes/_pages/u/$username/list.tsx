import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/u/$username/list')({
    loader: async ({ params }) => {
        throw redirect({
            to: '/_pages/u/$username/list/$content_type',
            params: {
                username: params.username,
                content_type: 'anime',
            },
        });
    },
});
