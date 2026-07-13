import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/settings/list/')({
    loader: async () => {
        throw redirect({ to: '/settings/list/import' });
    },
});
