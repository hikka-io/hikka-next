import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/settings/')({
    loader: async () => {
        throw redirect({ to: '/settings/profile' });
    },
});
