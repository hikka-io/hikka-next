import { createFileRoute } from '@tanstack/react-router';

import { usePageHeader } from '@/features/app-shell';
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
    usePageHeader({ title: 'Відновлення паролю', parent: '/login' });

    return (
        <div className="flex w-full flex-col gap-6">
            <ForgotPasswordHeader />
            <ForgotPasswordForm />
        </div>
    );
}
