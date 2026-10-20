import { type FC, useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { isUserReference } from '@hikka/core';

import BlockList from '@/components/block-list';
import ErrorState from '@/components/error-state';
import { shareSitePath } from '@/utils/share';

import FavouritesSection from './favourites-section';
import HistorySection from './history-section';
import ListStats from './list-stats';
import ProfileHeader from './profile-header';
import { userProfileOptions, userReferenceOptions } from './queries';
import UserSkeleton from './user-skeleton';

const hasUsername = (queryKey: readonly unknown[], username: string) => {
    const first = queryKey[0] as { path?: { username?: string } } | undefined;

    return first?.path?.username === username;
};

type Props = {
    username: string;
};

// A mention links to `/u/<uuid>`; resolve it to the username and replace the route.
const ReferenceRedirect: FC<{ reference: string }> = ({ reference }) => {
    const router = useRouter();
    const { data, error, refetch } = useQuery(
        userReferenceOptions({ path: { reference } }),
    );

    useEffect(() => {
        if (data?.username) {
            router.replace(`/u/${data.username}`);
        }
    }, [data, router]);

    if (error || (data && !data.username)) {
        return (
            <ErrorState
                error={error}
                onRetry={() => void refetch()}
                notFoundTitle="Користувача не знайдено"
            />
        );
    }

    return <UserSkeleton />;
};

const UserProfile: FC<Props> = ({ username }) => {
    const queryClient = useQueryClient();
    const { data, isPending, error, refetch } = useQuery(
        userProfileOptions({ path: { username } }),
    );
    const ready = Boolean(data);

    return (
        <>
            <Stack.Title>{data?.username ?? username}</Stack.Title>
            {Platform.OS === 'ios' && ready && (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Button
                        icon="square.and.arrow.up"
                        accessibilityLabel="Поділитися"
                        onPress={() =>
                            shareSitePath(
                                `/u/${username}`,
                                data?.username ?? username,
                            )
                        }
                    />
                </Stack.Toolbar>
            )}
            {isPending ? (
                <UserSkeleton />
            ) : error || !data ? (
                <ErrorState
                    error={error}
                    onRetry={() => void refetch()}
                    notFoundTitle="Користувача не знайдено"
                />
            ) : (
                <BlockList
                    blocks={[
                        <ProfileHeader key="header" user={data} />,
                        <ListStats key="stats" username={username} />,
                        <HistorySection key="history" username={username} />,
                        <FavouritesSection
                            key="favourites"
                            username={username}
                        />,
                    ]}
                    onRefresh={() =>
                        queryClient.invalidateQueries({
                            predicate: (query) =>
                                hasUsername(query.queryKey, username),
                        })
                    }
                />
            )}
        </>
    );
};

const UserPage: FC<Props> = ({ username }) =>
    isUserReference(username) ? (
        <ReferenceRedirect reference={username} />
    ) : (
        <UserProfile username={username} />
    );

export default UserPage;
