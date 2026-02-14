import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchUserByUsername } from '@hikka/react/server';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import CoverImage from '@/components/cover-image';
import FollowButton from '@/components/follow-button';
import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';

import {
    ActivationAlert,
    FollowStats,
    ListStats,
    UserInfo,
    UserTitle,
} from '@/features/users';

import { USER_NAV_ROUTES } from '@/utils/constants/navigation';
import { getHikkaClientConfig } from '@/utils/hikka-client';

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

    const user = await prefetchUserByUsername({
        username,
        clientConfig,
        queryClient,
    });

    if (!user) {
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { username }, queryClient });

    const dehydratedState = dehydrate(queryClient);

    if (dehydratedState.queries.length === 0) {
        return permanentRedirect('/404');
    }

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12 lg:gap-12">
                <ActivationAlert />
                <CoverImage cover={user?.cover} />
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

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-12">
                    <div className="flex flex-col gap-4 lg:gap-8">
                        <div className="flex gap-4 lg:gap-8">
                            <UserInfo />
                            <div className="flex flex-col gap-2 justify-between">
                                <div className="flex flex-col gap-2">
                                    <UserTitle />
                                    <FollowStats className="hidden lg:flex" />
                                </div>
                                <div className="hidden gap-4 lg:flex">
                                    <FollowButton username={username} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 lg:hidden">
                            <FollowStats />
                            <div className="gap-4 flex">
                                <FollowButton
                                    username={username}
                                    className="flex-1"
                                />
                            </div>
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
