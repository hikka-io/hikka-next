import { Redirect, Stack } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import { View } from 'react-native';

import ErrorState from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { SignInPrompt, useSession } from '@/features/auth';

/** The web's `/comments/my`: a redirect to the signed-in user's comments. */
export default function MyCommentsScreen() {
    const { user, hasToken, error, refetch } = useSession();

    if (user?.username) {
        return <Redirect href={`/comments/user/${user.username}`} />;
    }

    return (
        <>
            <Stack.Title>Мої коментарі</Stack.Title>
            {!hasToken ? (
                <SignInPrompt
                    icon={MessageSquare}
                    description="Увійдіть у свій акаунт, щоб переглянути свої коментарі"
                />
            ) : error ? (
                <ErrorState
                    error={error}
                    onRetry={() => void refetch()}
                    className="flex-1 justify-center"
                />
            ) : (
                <View className="flex-1 items-center justify-center bg-background">
                    <Spinner />
                </View>
            )}
        </>
    );
}
