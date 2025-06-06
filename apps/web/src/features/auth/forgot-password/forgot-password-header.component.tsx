import Link from 'next/link';

import H1 from '@/components/typography/h1';
import Small from '@/components/typography/small';

const ForgotPasswordHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <H1 className="!text-3xl font-bold">🔐 Відновити пароль</H1>
            <Small className="text-muted-foreground">
                Будь ласка, введіть дані для отримання листа відновлення.{' '}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                >
                    Повернутись до входу
                </Link>
            </Small>
        </div>
    );
};

export default ForgotPasswordHeader;
