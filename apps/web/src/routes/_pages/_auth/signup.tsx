import { createFileRoute } from '@tanstack/react-router';

import { usePageHeader } from '@/features/app-shell';
import { SignupForm, SignupHeader } from '@/features/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/_auth/signup')({
    head: () =>
        generateHeadMeta({
            title: 'Реєстрація',
            robots: { index: false },
        }),
    component: SignupPage,
});

function SignupPage() {
    usePageHeader({ title: 'Реєстрація', parent: '/login' });

    return (
        <div className="flex w-full flex-col gap-6">
            <SignupHeader />
            <SignupForm />
        </div>
    );
}
