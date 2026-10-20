import { useRouter } from 'expo-router';

import { LoginForm } from '@/features/auth';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <LoginForm
            onSuccess={() =>
                router.canGoBack() ? router.back() : router.replace('/')
            }
        />
    );
}
