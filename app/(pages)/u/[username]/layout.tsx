import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';

import ActivationAlert from '@/app/(pages)/u/[username]/_layout/activation-alert';
import FollowButton from '@/app/(pages)/u/[username]/_layout/follow-button';
import FollowStats from '@/app/(pages)/u/[username]/_layout/follow-stats';
import NavMenu from '@/app/(pages)/u/[username]/_layout/nav-menu';
import UserInfo from '@/app/(pages)/u/[username]/_layout/user-info';
import Breadcrumbs from '@/app/_components/breadcrumbs';
import Image from '@/app/_components/ui/image';
import SubBar from '@/app/_components/sub-navbar';
import { getCookie } from '@/app/actions';
import RQHydrate from '@/utils/RQ-hydrate';
import getFavouriteList from '@/utils/api/favourite/getFavouriteList';
import getFollowStats from '@/utils/api/follow/getFollowStats';
import getUserInfo, {
    Response as UserResponse,
} from '@/utils/api/user/getUserInfo';
import getWatchStats from '@/utils/api/watch/getWatchStats';
import getQueryClient from '@/utils/getQueryClient';

import NavBar from './_layout/navbar';


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
                    <NavMenu />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <NavBar />
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