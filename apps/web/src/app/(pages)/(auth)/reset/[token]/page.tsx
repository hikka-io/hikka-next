import { Metadata } from 'next';
import { FC } from 'react';

import { PasswordConfirmForm, PasswordConfirmHeader } from '@/features/auth';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

export const metadata: Metadata = _generateMetadata({
    title: 'Відновити пароль',
});

interface Props {
    params: {
        token: string;
    };
}

const PasswordConfirmPage: FC<Props> = () => {
    return (
        <div className="w-full space-y-6">
            <PasswordConfirmHeader />
            <PasswordConfirmForm />
        </div>
    );
};

export default PasswordConfirmPage;
