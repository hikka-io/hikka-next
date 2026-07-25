import { createFileRoute } from '@tanstack/react-router';

import { usePageHeader } from '@/features/app-shell';
import { LoginForm, LoginHeader } from '@/features/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/_auth/login')({
    head: () =>
        generateHeadMeta({
            title: 'Вхід',
            robots: { index: false },
        }),
    component: LoginPage,
});

function LoginPage() {
    usePageHeader({ title: 'Вхід', parent: '/' });

    return (
        <div className="flex w-full flex-col gap-6">
            <LoginHeader />
            <LoginForm />
        </div>
    );
}
