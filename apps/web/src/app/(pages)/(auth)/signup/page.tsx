import { Metadata } from 'next';
import { FC } from 'react';

import { SignupForm, SignupHeader } from '@/features/auth';

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
