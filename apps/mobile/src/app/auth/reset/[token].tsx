import { useLocalSearchParams } from 'expo-router';

import { PasswordConfirmForm, useCloseAuthFlow } from '@/features/auth';

export default function ResetConfirmScreen() {
    const { token } = useLocalSearchParams<{ token: string }>();
    const close = useCloseAuthFlow();

    return <PasswordConfirmForm token={token} onSuccess={close} />;
}
