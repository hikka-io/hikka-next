import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/settings/customization/')({
    beforeLoad: () => {
        throw redirect({ to: '/settings/customization/general' });
    },
});
