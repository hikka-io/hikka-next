import { Redirect, useLocalSearchParams } from 'expo-router';

// The web serves the form at /reset/<token>; the email link is /auth/reset/<token>.
export default function ResetAliasScreen() {
    const { token } = useLocalSearchParams<{ token: string }>();

    return <Redirect href={`/auth/reset/${token}`} />;
}
