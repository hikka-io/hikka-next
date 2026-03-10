import { Link } from '@/utils/navigation';

const SignupHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">✌️ Раді познайомитись!</h1>
            <small className="text-muted-foreground">
                Вже маєте аккаунт?{' '}
                <Link
                    to="/login"
                    className="font-medium text-primary-foreground hover:underline"
                >
                    Увійдіть зараз
                </Link>
            </small>
        </div>
    );
};

export default SignupHeader;
