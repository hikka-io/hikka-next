import { createFileRoute } from '@tanstack/react-router';

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
    return (
        <div className="w-full space-y-6">
            <LoginHeader />
            <LoginForm />
        </div>
    );
}
