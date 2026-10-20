import type { FC } from 'react';

import { Link } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { HikkaApiError } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { FALLBACK_ERROR } from './constants';
import { useSession } from './use-session';

const ProfileSummary: FC = () => {
    const { user, hasToken, isLoading, error } = useSession();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator />
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
            </View>
        );
    }

    if (hasToken && error) {
        return (
            <View className="flex-1 items-center justify-center bg-background p-6">
                <Text className="text-center text-destructive-foreground">
                    {error instanceof HikkaApiError
                        ? error.message
                        : FALLBACK_ERROR}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
            <Text className="text-center text-muted-foreground">
                Увійдіть, щоб відстежувати аніме та бачити свої списки
            </Text>
            <Link href="/login" asChild>
                <Button className="px-6">Увійти</Button>
            </Link>
        </View>
    );
};

export default ProfileSummary;
