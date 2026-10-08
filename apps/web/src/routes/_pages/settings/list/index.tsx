import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/settings/list/')({
    beforeLoad: () => {
        throw redirect({ to: '/settings/list/import' });
    },
});
