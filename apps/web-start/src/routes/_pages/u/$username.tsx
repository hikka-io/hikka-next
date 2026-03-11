import { ContentTypeEnum } from '@hikka/client';
import {
    readStatsOptions,
    userByUsernameOptions,
    userFollowStatsOptions,
    userWatchStatsOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import CoverImage from '@/components/cover-image';
import Link from '@/components/ui/link';

import Breadcrumbs from '@/features/common/nav-breadcrumbs';
import NavMenu from '@/features/common/nav-dropdown';
import {
    ActivationAlert,
    FollowStats,
    UserInfo,
    UserTitle,
} from '@/features/users';

import { USER_NAV_ROUTES } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/u/$username')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const { username } = params;

        const user = await queryClient.ensureQueryData(
            userByUsernameOptions(hikkaClient, { username }),
        );

        if (!user) throw redirect({ to: '/' });

        await Promise.allSettled([
            queryClient.prefetchQuery(
                readStatsOptions(hikkaClient, {
                    username,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.prefetchQuery(
                readStatsOptions(hikkaClient, {
                    username,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.prefetchQuery(
                userWatchStatsOptions(hikkaClient, { username }),
            ),
            queryClient.prefetchQuery(
                userFollowStatsOptions(hikkaClient, { username }),
            ),
        ]);

        return { user };
    },
    head: ({ loaderData }) => {
        const user = loaderData?.user;
        if (!user) return {};

        return generateHeadMeta({
            title: user.username,
            description: user.description,
            image: `https://preview.hikka.io/u/${user.username}/${user.updated}`,
            url: `https://hikka.io/u/${user.username}`,
        });
    },
    component: UserLayout,
});

function UserLayout() {
    const { username } = Route.useParams();
    const { user } = Route.useLoaderData();

    return (
        <div className="flex flex-col gap-12 lg:gap-12">
            <ActivationAlert />
            <CoverImage cover={user?.cover} />
            <Breadcrumbs>
                <Link
                    to={`/u/${username}`}
                    className="line-clamp-1 break-all text-sm font-bold hover:underline"
                >
                    {username}
                </Link>
                <NavMenu
                    routes={USER_NAV_ROUTES}
                    urlPrefix={`/u/${username}`}
                />
            </Breadcrumbs>
            <div className="flex gap-4 lg:gap-8 lg:items-end flex-col md:flex-row">
                <div className="flex gap-4 lg:gap-8 flex-1">
                    <UserInfo />
                    <UserTitle />
                </div>
                <FollowStats />
            </div>
            <div className="flex flex-col gap-12">
                <Outlet />
            </div>
        </div>
    );
}
