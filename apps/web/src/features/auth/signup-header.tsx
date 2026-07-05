import { Link } from '@/utils/navigation';

import AuthHeader from './auth-header';

const SignupHeader = () => {
    return (
        <AuthHeader title="✌️ Раді познайомитись!">
            Вже маєте аккаунт?{' '}
            <Link
                to="/login"
                className="font-medium text-primary-foreground hover:underline"
            >
                Увійдіть зараз
            </Link>
        </AuthHeader>
    );
};

export default SignupHeader;
