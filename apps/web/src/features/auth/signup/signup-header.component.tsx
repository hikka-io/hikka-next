import Link from 'next/link';

import H1 from '@/components/typography/h1';
import Small from '@/components/typography/small';

const SignupHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <H1 className="!text-3xl font-bold">✌️ Раді познайомитись!</H1>
            <Small className="text-muted-foreground">
                Вже маєте аккаунт?{' '}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                >
                    Увійдіть зараз
                </Link>
            </Small>
        </div>
    );
};

export default SignupHeader;
