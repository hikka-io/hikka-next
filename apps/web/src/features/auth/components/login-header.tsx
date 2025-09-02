import Link from 'next/link';

import H1 from '@/components/typography/h1';
import Small from '@/components/typography/small';

const LoginHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <H1 className="!text-3xl font-bold">👋 З поверненням!</H1>
            <Small className="text-muted-foreground">
                Не маєте аккаунту?{' '}
                <Link
                    href="/signup"
                    className="text-primary-foreground font-medium hover:underline"
                >
                    Зареєструйтесь зараз
                </Link>
            </Small>
        </div>
    );
};

export default LoginHeader;
