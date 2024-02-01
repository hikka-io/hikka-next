import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';

import Breadcrumbs from '@/app/_components/breadcrumbs';
import InternalNavBar from '@/app/_components/internal-navbar';
import NavMenu from '@/app/_components/nav-menu';
import SubBar from '@/app/_components/sub-navbar';
import Image from '@/app/_components/ui/image';
import RQHydrate from '@/app/_utils/RQ-hydrate';
import getFavouriteList from '@/app/_utils/api/favourite/getFavouriteList';
import getFollowStats from '@/app/_utils/api/follow/getFollowStats';
import getUserInfo, {
    Response as UserResponse,
} from '@/app/_utils/api/user/getUserInfo';
import getWatchStats from '@/app/_utils/api/watch/getWatchStats';
import { USER_NAV_ROUTES } from '@/app/_utils/constants';
import getQueryClient from '@/app/_utils/getQueryClient';
import { getCookie } from '@/app/actions';

import ActivationAlert from './_components/activation-alert';
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
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery({
        queryKey: ['user', username],
        queryFn: () => getUserInfo({ username }),
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['favorites', username, secret],
        queryFn: () => getFavouriteList({ username }),
        initialPageParam: 1,
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

    const user: Hikka.User | undefined = queryClient.getQueryData([
        'user',
        username,
    ]);

    if (!user) {
        return redirect('/');
    }

    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                {user.cover && (
                    <div className="absolute top-0 left-0 w-full h-80 -z-20 opacity-40 overflow-hidden rounded-b-lg">
                        <Image
                            src={user.cover}
                            className="relative w-full h-full object-cover"
                            alt="cover"
                            width={1500}
                            height={500}
                        />
                        <div className="bg-gradient-to-b from-transparent dark:to-black to-white absolute bottom-0 left-0 w-full h-full z-30" />
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
                <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <UserInfo />
                    <FollowStats />
                    <FollowButton />
                </div>
                <div className="flex flex-col gap-12">
                    <ActivationAlert />
                    {children}
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;