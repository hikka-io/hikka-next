import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/auth/reset/$token')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const { token } = params;

                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: '/reset/' + token,
                    },
                });
            },
        },
    },
});
