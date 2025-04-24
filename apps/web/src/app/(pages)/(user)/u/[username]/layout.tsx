import { UserResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    queryKeys,
} from '@hikka/react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import FollowButton from '@/components/follow-button';
import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';
import UserCover from '@/components/user-cover';

import ActivationAlert from '@/features/users/activation-alert.component';
import FollowStats from '@/features/users/follow-stats.component';
import ListStats from '@/features/users/list-stats/list-stats.component';
import UserInfo from '@/features/users/user-info.component';
import UserTitle from '@/features/users/user-title.component';

import { USER_NAV_ROUTES } from '@/utils/constants/navigation';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

import _generateMetadata, { MetadataProps } from './layout.metadata';
import prefetchQueries from './layout.queries';

interface Props extends PropsWithChildren {
    params: {
        username: string;
    };
}

export async function generateMetadata(
    props: MetadataProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;

    return await _generateMetadata({ params }, parent);
}

const UserLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { username } = params;
    const { children } = props;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchQueries({ params: { username } });

    const dehydratedState = dehydrate(queryClient);

    if (dehydratedState.queries.length === 0) {
        return permanentRedirect('/404');
    }

    const user: UserResponse | undefined = queryClient.getQueryData(
        queryKeys.user.byUsername(username),
    );

    if (!user) {
        return permanentRedirect('/');
    }

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12 lg:gap-16">
                <ActivationAlert />
                <UserCover username={username} />
                <Breadcrumbs>
                    <Link
                        href={`/u/${username}`}
                        className="line-clamp-1 break-all text-sm font-bold hover:underline"
                    >
                        {username}
                    </Link>
                    <NavMenu
                        routes={USER_NAV_ROUTES}
                        urlPrefix={`/u/${username}`}
                    />
                </Breadcrumbs>
                <SubBar>
                    <InternalNavBar
                        routes={USER_NAV_ROUTES}
                        urlPrefix={`/u/${username}`}
                    />
                </SubBar>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                    <div className="flex flex-col gap-4 lg:gap-8">
                        <div className="flex gap-4 lg:gap-8">
                            <UserInfo />
                            <div className="flex flex-col gap-2">
                                <UserTitle />
                                <FollowStats className="hidden lg:flex" />
                                <div className="hidden flex-1 flex-col justify-end gap-2 lg:flex">
                                    <FollowButton
                                        className="w-fit"
                                        username={username}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 lg:hidden">
                            <FollowStats />
                            <FollowButton
                                username={username}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <ListStats />
                    </div>
                </div>
                <div className="flex flex-col gap-12">{children}</div>
            </div>
        </HydrationBoundary>
    );
};

export default UserLayout;
