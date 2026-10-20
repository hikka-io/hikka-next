import type { FC } from 'react';

import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { HikkaApiError } from '@hikka/api';

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
                <Image
                    source={user.avatar}
                    style={{ width: 96, height: 96, borderRadius: 48 }}
                    contentFit="cover"
                />
                <View className="items-center gap-1">
                    <Text className="font-bold text-foreground text-xl">
                        {user.username}
                    </Text>
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
                <Pressable className="h-12 items-center justify-center rounded-lg border border-primary-border bg-primary px-6 active:opacity-80">
                    <Text className="font-semibold text-base text-primary-foreground">
                        Увійти
                    </Text>
                </Pressable>
            </Link>
        </View>
    );
};

export default ProfileSummary;
