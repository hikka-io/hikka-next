import { SignupForm, useCloseAuthFlow } from '@/features/auth';

export default function SignupScreen() {
    const close = useCloseAuthFlow();

    return <SignupForm onSuccess={close} />;
}
