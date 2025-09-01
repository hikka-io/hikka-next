import { Metadata } from 'next';
import { FC } from 'react';

import SignupForm from '@/features/auth/signup/signup-form';
import SignupHeader from '@/features/auth/signup/signup-header';

import _generateMetadata from '@/utils/generate-metadata';

export const metadata: Metadata = _generateMetadata({
    title: 'Реєстрація',
});

const SignupPage: FC = () => {
    return (
        <div className="w-full space-y-6">
            <SignupHeader />
            <SignupForm />
        </div>
    );
};

export default SignupPage;
