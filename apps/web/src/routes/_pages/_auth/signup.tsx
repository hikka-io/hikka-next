import { createFileRoute } from '@tanstack/react-router';

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
    return (
        <div className="w-full space-y-6">
            <SignupHeader />
            <SignupForm />
        </div>
    );
}
