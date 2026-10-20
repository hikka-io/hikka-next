import { type FC, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { isUserReference } from '@hikka/core';

import BlockList from '@/components/block-list';
import ErrorState from '@/components/ui/error-state';
import { byUsername, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';
import { shareSitePath } from '@/utils/share';

import FavouritesSection from './favourites-section';
import HistorySection from './history-section';
import ListStats from './list-stats';
import ProfileHeader from './profile-header';
import { userProfileOptions, userReferenceOptions } from './queries';
import UserSkeleton from './user-skeleton';

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
    const { data, isPending, error, refetch } = useQuery(
        userProfileOptions({ path: { username } }),
    );
    // The route param may differ in case from the stored name; every other query uses the stored one.
    const name = data?.username;
    const { refreshing, onRefresh } = usePullToRefresh(
        byUsername(name ? [username, name] : [username]),
    );

    return (
        <>
            <Stack.Title>{name ?? username}</Stack.Title>
            {Platform.OS === 'ios' && name && (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Button
                        icon="square.and.arrow.up"
                        accessibilityLabel="Поділитися"
                        onPress={() => shareSitePath(`/u/${name}`)}
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
            ) : !name ? (
                <ErrorState
                    error={null}
                    notFound
                    onRetry={() => void refetch()}
                    notFoundTitle="Користувача не знайдено"
                />
            ) : (
                <BlockList
                    blocks={[
                        <ProfileHeader
                            key="header"
                            user={data}
                            username={name}
                        />,
                        <ListStats key="stats" username={name} />,
                        <HistorySection key="history" username={name} />,
                        <FavouritesSection key="favourites" username={name} />,
                    ]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
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
