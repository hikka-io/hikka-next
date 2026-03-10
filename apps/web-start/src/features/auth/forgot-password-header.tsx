import Link from 'next/link';

const ForgotPasswordHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">🔐 Відновити пароль</h1>
            <small className="text-muted-foreground">
                Будь ласка, введіть дані для отримання листа відновлення.{' '}
                <Link
                    href="/login"
                    className="font-medium text-primary-foreground hover:underline"
                >
                    Повернутись до входу
                </Link>
            </small>
        </div>
    );
};

export default ForgotPasswordHeader;
