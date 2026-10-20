import { Redirect, Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/features/auth';

/** The web's `/comments/my`: a redirect to the signed-in user's comments. */
export default function MyCommentsScreen() {
    const router = useRouter();
    const { user, hasToken, error, refetch } = useSession();

    if (user?.username) {
        return <Redirect href={`/comments/user/${user.username}`} />;
    }

    return (
        <>
            <Stack.Title>Мої коментарі</Stack.Title>
            {!hasToken ? (
                <EmptyState
                    title="Ви не авторизовані"
                    description="Увійдіть у свій акаунт, щоб переглянути свої коментарі"
                    action={
                        <Button size="md" onPress={() => router.push('/login')}>
                            Увійти
                        </Button>
                    }
                    className="flex-1 justify-center bg-background"
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
