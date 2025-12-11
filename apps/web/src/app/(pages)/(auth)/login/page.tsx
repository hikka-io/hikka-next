import { Metadata } from 'next';
import { FC } from 'react';

import { LoginForm, LoginHeader } from '@/features/auth';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

export const metadata: Metadata = _generateMetadata({
    title: 'Вхід',
});

const LoginPage: FC = () => {
    return (
        <div className="w-full space-y-6">
            <LoginHeader />
            <LoginForm />
        </div>
    );
};

export default LoginPage;
