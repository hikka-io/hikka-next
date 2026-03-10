import { createFileRoute } from '@tanstack/react-router';

import { LoginForm, LoginHeader } from '@/features/auth';

export const Route = createFileRoute('/_pages/_auth/login')({
    head: () => ({
        meta: [{ title: 'Вхід — Hikka' }],
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
