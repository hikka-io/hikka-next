import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/google')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const target = new URL('/api/auth/google', url.origin);
                target.search = url.search;

                return new Response(null, {
                    status: 302,
                    headers: { Location: target.toString() },
                });
            },
        },
    },
});
