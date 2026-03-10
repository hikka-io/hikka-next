import { createFileRoute } from '@tanstack/react-router';

import { SignupForm, SignupHeader } from '@/features/auth';

export const Route = createFileRoute('/_pages/_auth/signup')({
    head: () => ({
        meta: [{ title: 'Реєстрація — Hikka' }],
    }),
    component: SignupPage,
});

function SignupPage() {
    return (
        <div className="w-full space-y-6">
            <SignupHeader />
            <SignupForm />
        </div>
    );
}
