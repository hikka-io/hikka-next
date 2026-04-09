import { createFileRoute } from '@tanstack/react-router';

// Password-reset emails link to /auth/reset/<token>; this server handler
// 302s to the SPA reset page so the client never has to render twice.
export const Route = createFileRoute('/auth/reset/$token')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                return new Response(null, {
                    status: 302,
                    headers: { Location: '/reset/' + params.token },
                });
            },
        },
    },
});
