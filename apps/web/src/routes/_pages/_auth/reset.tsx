import { createFileRoute } from '@tanstack/react-router';

import { ForgotPasswordForm, ForgotPasswordHeader } from '@/features/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/_auth/reset')({
    head: () =>
        generateHeadMeta({
            title: 'Відновити пароль',
            robots: { index: false },
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
