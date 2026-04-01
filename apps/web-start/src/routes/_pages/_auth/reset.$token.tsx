import { createFileRoute } from '@tanstack/react-router';

import { PasswordConfirmForm, PasswordConfirmHeader } from '@/features/auth';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/_auth/reset/$token')({
    head: () =>
        generateHeadMeta({
            title: 'Відновити пароль',
            robots: { index: false },
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
