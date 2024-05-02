import { Metadata, ResolvingMetadata } from 'next';
import React, { FC, PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';
import Image from '@/components/ui/image';
import { USER_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import ActivationAlert from './components/activation-alert';
import FollowButton from './components/follow-button';
import FollowStats from './components/follow-stats';
import ListStats from './components/list-stats';
import UserInfo from './components/user-info';
import UserTitle from './components/user-title';
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
    return await _generateMetadata(props, parent);
}

const UserLayout: FC<Props> = async ({ params: { username }, children }) => {
    const queryClient = await getQueryClient();

    await prefetchQueries({ queryClient, params: { username } });

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
                <ActivationAlert />
                {user.cover && (
                    <div className="absolute left-0 top-0 -z-20 h-80 w-full overflow-hidden opacity-40 gradient-mask-b-0">
                        <Image
                            src={user.cover}
                            className="relative size-full object-cover"
                            alt="cover"
                            fill
                            priority
                        />
                    </div>
                )}
                <Breadcrumbs>
                    <Link
                        href={`/u/${username}`}
                        className="text-sm font-bold hover:underline"
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
                                    <FollowButton />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 lg:hidden">
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

export default UserLayout;
