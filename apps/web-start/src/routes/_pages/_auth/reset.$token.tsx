import { createFileRoute } from '@tanstack/react-router';

import { PasswordConfirmForm, PasswordConfirmHeader } from '@/features/auth';

export const Route = createFileRoute('/_pages/_auth/reset/$token')({
    head: () => ({
        meta: [{ title: 'Відновити пароль — Hikka' }],
    }),
    component: PasswordConfirmPage,
});

function PasswordConfirmPage() {
    return (
        <div className="w-full space-y-6">
            <PasswordConfirmHeader />
            <PasswordConfirmForm />
        </div>
    );
}
