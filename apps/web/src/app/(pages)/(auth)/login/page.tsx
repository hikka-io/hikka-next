import { Metadata } from 'next';
import { FC } from 'react';

import LoginForm from '@/features/auth/login/login-form.component';
import LoginHeader from '@/features/auth/login/login-header.component';

import _generateMetadata from '@/utils/generate-metadata';

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
