import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/settings/customization/')({
    loader: async () => {
        throw redirect({ to: '/settings/customization/general' });
    },
});
