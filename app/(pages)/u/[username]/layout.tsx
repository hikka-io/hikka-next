import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import ListStats from '@/app/(pages)/u/[username]/_components/list-stats';
import UserTitle from '@/app/(pages)/u/[username]/_components/user-title';
import { getCookie } from '@/app/actions';
import Breadcrumbs from '@/components/breadcrumbs';
import InternalNavBar from '@/components/internal-navbar';
import NavMenu from '@/components/nav-menu';
import SubBar from '@/components/sub-navbar';
import Image from '@/components/ui/image';
import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import getFollowStats from '@/services/api/follow/getFollowStats';
import getUserHistory from '@/services/api/user/getUserHistory';
import getUserInfo, {
    Response as UserResponse,
} from '@/services/api/user/getUserInfo';
import getWatchStats from '@/services/api/watch/getWatchStats';
import { USER_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import FollowButton from './_components/follow-button';
import FollowStats from './_components/follow-stats';
import UserInfo from './_components/user-info';


interface Props extends PropsWithChildren {
    params: {
        username: string;
    };
}

// export const runtime = 'edge';

export async function generateMetadata(
    {
        params,
    }: {
        params: {
            username: string;
        };
    },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;
    const username = params.username;

    const user: UserResponse = await getUserInfo({ username });

    return {
        title: {
            default: user.username,
            template: user.username + ' / %s / Hikka',
        },
        description: user.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: {
                default: user.username,
                template: user.username + ' / %s / Hikka',
            },
            description: user.description || '',
            images: 'https://hikka.io/generate/preview/u/' + username,
        },
        twitter: {
            title: {
                default: user.username,
                template: user.username + ' / %s / Hikka',
            },
            description: user.description || '',
            images: 'https://hikka.io/generate/preview/u/' + username,
        },
    };
}

const Component = async ({ params: { username }, children }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['user', username],
        queryFn: () => getUserInfo({ username }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['watchStats', username],
        queryFn: () => getWatchStats({ username }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['followStats', username],
        queryFn: () => getFollowStats({ username }),
    });

    const dehydratedState = dehydrate(queryClient);

    if (dehydratedState.queries.length === 0) {
        return redirect('/404');
    }

    const user: API.User | undefined = queryClient.getQueryData([
        'user',
        username,
    ]);

    if (!user) {
        return redirect('/');
    }

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12 lg:gap-16">
                {user.cover && (
                    <div className="absolute top-0 left-0 w-full h-80 -z-20 opacity-40 overflow-hidden gradient-mask-b-0">
                        <Image
                            src={user.cover}
                            className="relative w-full h-full object-cover"
                            alt="cover"
                            width={1500}
                            height={500}
                        />
                    </div>
                )}
                <Breadcrumbs>
                    <Link
                        href={'/u/' + user?.username}
                        className="text-sm font-bold hover:underline"
                    >
                        {user?.username}
                    </Link>
                    <NavMenu
                        routes={USER_NAV_ROUTES}
                        urlPrefix={'/u/' + username}
                    />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <InternalNavBar
                        routes={USER_NAV_ROUTES}
                        urlPrefix={'/u/' + username}
                    />
                </SubBar>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                    <div className="flex flex-col lg:gap-8 gap-4">
                        <div className="flex lg:gap-8 gap-4">
                            <UserInfo />
                            <div className="flex flex-col gap-2">
                                <UserTitle />
                                <FollowStats className="hidden lg:flex" />
                                <div className="flex-col gap-2 flex-1 justify-end hidden lg:flex">
                                    <FollowButton />
                                </div>
                            </div>
                        </div>
                        <div className="lg:hidden flex flex-col gap-4">
                            <FollowStats />
                            <FollowButton className="w-full" />
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

export default Component;