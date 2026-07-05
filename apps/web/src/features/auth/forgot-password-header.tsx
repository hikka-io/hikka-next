import { Link } from '@/utils/navigation';

import AuthHeader from './auth-header';

const ForgotPasswordHeader = () => {
    return (
        <AuthHeader title="🔐 Відновити пароль">
            Будь ласка, введіть дані для отримання листа відновлення.{' '}
            <Link
                to="/login"
                className="font-medium text-primary-foreground hover:underline"
            >
                Повернутись до входу
            </Link>
        </AuthHeader>
    );
};

export default ForgotPasswordHeader;
