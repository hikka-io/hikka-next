import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/settings/applications/')({
    loader: async () => {
        throw redirect({ to: '/settings/applications/authorized' });
    },
});
