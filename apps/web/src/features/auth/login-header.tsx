import { Link } from '@/utils/navigation';

import AuthHeader from './auth-header';

const LoginHeader = () => {
    return (
        <AuthHeader title="👋 З поверненням!">
            Не маєте аккаунту?{' '}
            <Link
                to="/signup"
                className="font-medium text-primary-foreground hover:underline"
            >
                Зареєструйтесь зараз
            </Link>
        </AuthHeader>
    );
};

export default LoginHeader;
