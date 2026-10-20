import { LoginForm, useCloseAuthFlow } from '@/features/auth';

export default function LoginScreen() {
    const close = useCloseAuthFlow();

    return <LoginForm onSuccess={close} />;
}
