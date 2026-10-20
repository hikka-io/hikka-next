import type { FC } from 'react';

import { UserRound } from 'lucide-react-native';
import { View } from 'react-native';

import { UserRoleEnum } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ErrorState from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

import ActivationAlert from './activation-alert';
import SignInPrompt from './sign-in-prompt';
import { useSession } from './use-session';

const ProfileSummary: FC = () => {
    const { user, hasToken, isLoading, error, refetch } = useSession();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <Spinner />
            </View>
        );
    }

    if (user) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
                <Avatar className="size-24">
                    <AvatarImage
                        src={user.avatar}
                        alt={user.username ?? undefined}
                        size={96}
                    />
                    <AvatarFallback>
                        {user.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <View className="items-center gap-1">
                    <Text className="font-bold text-xl">{user.username}</Text>
                    <Text className="text-muted-foreground text-sm">
                        {user.email}
                    </Text>
                </View>
                {user.role === UserRoleEnum.NOT_ACTIVATED && user.username ? (
                    <ActivationAlert username={user.username} />
                ) : null}
            </View>
        );
    }

    if (hasToken && error) {
        return (
            <ErrorState
                error={error}
                onRetry={() => void refetch()}
                className="flex-1 justify-center"
            />
        );
    }

    return (
        <SignInPrompt
            icon={UserRound}
            description="Увійдіть, щоб відстежувати аніме та бачити свої списки"
        />
    );
};

export default ProfileSummary;
