import { createFileRoute, Outlet } from '@tanstack/react-router';

import CoverImage from '@/components/cover-image';

export const Route = createFileRoute('/_pages/_auth')({
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
