import { createFileRoute } from '@tanstack/react-router';

import { ForgotPasswordForm, ForgotPasswordHeader } from '@/features/auth';

export const Route = createFileRoute('/_pages/_auth/reset')({
    head: () => ({
        meta: [{ title: 'Відновити пароль — Hikka' }],
    }),
    component: ResetPage,
});

function ResetPage() {
    return (
        <div className="w-full space-y-6">
            <ForgotPasswordHeader />
            <ForgotPasswordForm />
        </div>
    );
}
