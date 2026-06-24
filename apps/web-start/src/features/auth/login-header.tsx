import { Link } from '@/utils/navigation';

const LoginHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <h1 className="font-bold text-3xl">👋 З поверненням!</h1>
            <small className="text-muted-foreground">
                Не маєте аккаунту?{' '}
                <Link
                    to="/signup"
                    className="font-medium text-primary-foreground hover:underline"
                >
                    Зареєструйтесь зараз
                </Link>
            </small>
        </div>
    );
};

export default LoginHeader;
