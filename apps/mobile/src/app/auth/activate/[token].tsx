import { useLocalSearchParams } from 'expo-router';

import { Activation, useCloseAuthFlow } from '@/features/auth';

export default function ActivateScreen() {
    const { token } = useLocalSearchParams<{ token: string }>();
    const close = useCloseAuthFlow();

    return <Activation token={token} onDone={close} />;
}
