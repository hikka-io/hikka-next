import { queryKeys } from '@hikka/react/core';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import CoverImage from '@/components/cover-image';

export const Route = createFileRoute('/_pages/_auth')({
    beforeLoad: async ({ context: { queryClient } }) => {
        const session = queryClient.getQueryData(queryKeys.user.me());
        if (session) {
            throw redirect({ to: '/' });
        }
    },
    component: AuthLayout,
});

function AuthLayout() {
    return (
        <div className="w-full mx-auto flex min-h-[inherit] max-w-lg items-center justify-center p-0">
            <CoverImage cover="/hikka.art.w.jpg" position="bottom" />
            <Outlet />
        </div>
    );
}
