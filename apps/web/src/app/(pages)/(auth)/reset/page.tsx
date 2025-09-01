import { Metadata } from 'next';
import { FC } from 'react';

import ForgotPasswordForm from '@/features/auth/forgot-password/forgot-password-form';
import ForgotPasswordHeader from '@/features/auth/forgot-password/forgot-password-header';

import _generateMetadata from '@/utils/generate-metadata';

export const metadata: Metadata = _generateMetadata({
    title: 'Відновити пароль',
});

const ResetPage: FC = () => {
    return (
        <div className="w-full space-y-6">
            <ForgotPasswordHeader />
            <ForgotPasswordForm />
        </div>
    );
};

export default ResetPage;
