import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';

import ActivationAlert from '@/app/(pages)/u/[username]/_layout/ActivationAlert';
import FollowListModal from '@/app/(pages)/u/[username]/_layout/FollowListModal';
import NavMenu from '@/app/(pages)/u/[username]/_layout/NavMenu';
import User from '@/app/(pages)/u/[username]/_layout/User';
import Breadcrumbs from '@/app/_components/Breadcrumbs';
import SubBar from '@/app/_components/SubBar';
import { getCookie } from '@/app/actions';
import RQHydrate from '@/utils/RQHydrate';
import getFavouriteList from '@/utils/api/favourite/getFavouriteList';
import getFollowStats from '@/utils/api/follow/getFollowStats';
import getUserInfo, {
    Response as UserResponse,
} from '@/utils/api/user/getUserInfo';
import getWatchStats from '@/utils/api/watch/getWatchStats';
import getQueryClient from '@/utils/getQueryClient';

import NavBar from './_layout/NavBar';

interface Props extends PropsWithChildren {
    params: {
        username: string;
    };
}

export const runtime = 'edge';

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
    const username = params.username;

    const user: UserResponse = await getUserInfo({ username });

    return {
        title: {
            default: user.username,
            template: user.username + ' / %s / Hikka',
        },
        description: user.description,
        openGraph: {
            title: {
                default: user.username,
                template: user.username + ' / %s / Hikka',
            },
            description: user.description || '',
            images: 'https://hikkaio.vercel.app/generate/preview/u/' + username,
        },
        twitter: {
            title: {
                default: user.username,
                template: user.username + ' / %s / Hikka',
            },
            description: user.description || '',
            images: 'https://hikkaio.vercel.app/generate/preview/u/' + username,
        },
    };
}

const Component = async ({ params: { username }, children }: Props) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery(['user', username], () =>
        getUserInfo({ username }),
    );

    await queryClient.prefetchInfiniteQuery(
        ['favorites', username, secret],
        () => getFavouriteList({ username }),
    );

    await queryClient.prefetchQuery(['watchStats', username], () =>
        getWatchStats({ username }),
    );

    await queryClient.prefetchQuery(['followStats', username], () =>
        getFollowStats({ username }),
    );

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
                <FollowListModal />
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
                <div className="flex flex-col gap-12 lg:sticky lg:top-20 lg:self-start">
                    <User />
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
