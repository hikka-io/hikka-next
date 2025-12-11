import { Metadata } from 'next';
import { FC } from 'react';

import { ForgotPasswordForm, ForgotPasswordHeader } from '@/features/auth';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

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
