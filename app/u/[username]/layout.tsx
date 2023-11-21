import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import RQHydrate from '@/utils/RQHydrate';
import { PropsWithChildren } from 'react';
import User from '@/app/u/[username]/_layout/User';
import getUserInfo, { Response as UserResponse } from '@/utils/api/user/getUserInfo';
import getFavouriteList from '@/utils/api/favourite/getFavouriteList';
import getWatchStats from '@/utils/api/watch/getWatchStats';
import NavBar from '@/app/u/[username]/_layout/NavBar';
import { redirect } from 'next/navigation';
import getFollowings from '@/utils/api/follow/getFollowings';
import getFollowers from '@/utils/api/follow/getFollowers';
import Followers from '@/app/u/[username]/_layout/Followers';
import Followings from '@/app/u/[username]/_layout/Followings';
import {Metadata, ResolvingMetadata} from "next";
import ActivationAlert from "@/app/u/[username]/_layout/ActivationAlert";

interface Props extends PropsWithChildren {
    params: { username: string };
}

export async function generateMetadata(
    { params }: { params: { username: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const username = params.username;

    const user: UserResponse = await getUserInfo({ username });

    return {
        title: { default: user.username, template: user.username + ' / %s / Hikka' },
        description: user.description,
        openGraph: {
            title: { default: user.username, template: user.username + ' / %s / Hikka' },
            description: user.description || "",
            images: user.avatar,
        },
        twitter: {
            title: { default: user.username, template: user.username + ' / %s / Hikka' },
            description: user.description || "",
            images: user.avatar,
        },
    };
}

const Component = async ({ params: { username }, children }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(['user', username], () =>
        getUserInfo({ username }),
    );

    await queryClient.prefetchInfiniteQuery(['favorites', username], () =>
        getFavouriteList({ username }),
    );

    await queryClient.prefetchQuery(['watchStats', username], () =>
        getWatchStats({ username }),
    );

    await queryClient.prefetchQuery(['followings', username], () =>
        getFollowings({ username }),
    );

    await queryClient.prefetchQuery(['followers', username], () =>
        getFollowers({ username }),
    );

    const dehydratedState = dehydrate(queryClient);

    if (dehydratedState.queries.length === 0) {
        return redirect('/404');
    }

    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 lg:grid-cols-[20%_1fr] lg:gap-16 gap-12">
                <div className="flex flex-col gap-12 lg:sticky lg:top-20 lg:self-start">
                    <User />
                    <div className="lg:flex flex-col gap-12 hidden">
                        <Followers />
                        <Followings />
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <ActivationAlert />
                    <NavBar />
                    {children}
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;
