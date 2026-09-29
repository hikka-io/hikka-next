import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { usePageHeader } from '@/features/app-shell';
import { LoginForm, LoginHeader } from '@/features/auth';
import { generateHeadMeta } from '@/utils/metadata';
import { loginSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/_auth/login')({
    validateSearch: zodValidator(loginSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Вхід',
            robots: { index: false },
        }),
    component: LoginPage,
});

function LoginPage() {
    usePageHeader({ title: 'Вхід', parent: '/' });

    return (
        <div className="flex w-full flex-col gap-6">
            <LoginHeader />
            <LoginForm />
        </div>
    );
}
