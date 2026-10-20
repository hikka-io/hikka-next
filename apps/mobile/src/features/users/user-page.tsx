import { type FC, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { UserRoleEnum } from '@hikka/api';
import { isUserReference } from '@hikka/core';

import BlockList from '@/components/block-list';
import DetailHeaderChrome from '@/components/detail-header-chrome';
import ErrorState from '@/components/ui/error-state';
import { ActivationAlert, useSession } from '@/features/auth';
import { isNotFoundError } from '@/utils/api/is-not-found';
import { byUsername, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';
import { useRefetchStaleOnFocus } from '@/utils/api/use-refetch-stale-on-focus';

import FavouritesSection from './favourites/favourites-section';
import HistorySection from './history-section';
import ListStats from './list-stats';
import ProfileHeader from './profile-header';
import { userProfileOptions, userReferenceOptions } from './queries';
import UserSkeleton from './user-skeleton';

type Props = {
    username: string;
    // The Profile tab draws its own title and toolbar.
    headerChrome?: boolean;
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
                notFound={!error || isNotFoundError(error)}
                notFoundTitle="Користувача не знайдено"
            />
        );
    }

    return <UserSkeleton />;
};

const UserProfile: FC<Props> = ({ username, headerChrome = true }) => {
    const { data, isPending, error, refetch } = useQuery(
        userProfileOptions({ path: { username } }),
    );
    // The route param may differ in case from the stored name; every other query uses the stored one.
    const name = data?.username;
    const { user: viewer } = useSession();
    const activationPending =
        !!name &&
        viewer?.username === name &&
        viewer.role === UserRoleEnum.NOT_ACTIVATED;
    const names = name ? [username, name] : [username];
    const { refreshing, onRefresh } = usePullToRefresh(byUsername(names));
    useRefetchStaleOnFocus(names.join('/'), byUsername(names));

    return (
        <>
            {headerChrome && (
                <DetailHeaderChrome
                    title={name ?? username}
                    sharePath={name ? `/u/${name}` : undefined}
                />
            )}
            {isPending ? (
                <UserSkeleton />
            ) : error || !data ? (
                <ErrorState
                    error={error}
                    onRetry={() => void refetch()}
                    notFound={isNotFoundError(error)}
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
                        ...(activationPending
                            ? [
                                  <View key="activation" className="px-4 pt-4">
                                      <ActivationAlert username={name} />
                                  </View>,
                              ]
                            : []),
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

const UserPage: FC<Props> = ({ username, headerChrome }) =>
    isUserReference(username) ? (
        <ReferenceRedirect reference={username} />
    ) : (
        <UserProfile username={username} headerChrome={headerChrome} />
    );

export default UserPage;
