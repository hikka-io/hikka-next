import { createFileRoute } from '@tanstack/react-router';

import { usePageHeader } from '@/features/app-shell';
import { PasswordConfirmForm, PasswordConfirmHeader } from '@/features/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/_auth/reset_/$token')({
    head: () =>
        generateHeadMeta({
            title: 'Відновити пароль',
            robots: { index: false },
        }),
    component: PasswordConfirmPage,
});

function PasswordConfirmPage() {
    usePageHeader({ title: 'Новий пароль', parent: '/login' });

    return (
        <div className="flex w-full flex-col gap-6">
            <PasswordConfirmHeader />
            <PasswordConfirmForm />
        </div>
    );
}
