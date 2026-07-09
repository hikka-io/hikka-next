import {
    createFileRoute,
    notFound,
    Outlet,
    redirect,
} from '@tanstack/react-router';

import {
    ContentTypeEnum,
    followStatsOptions,
    userProfileOptions,
    userReadStatsOptions,
    userReferenceOptions,
    userWatchStatsOptions,
} from '@hikka/api';

import CoverImage from '@/components/cover-image';
import Link from '@/components/ui/link';
import Breadcrumbs from '@/features/app-shell/nav-breadcrumbs';
import NavMenu from '@/features/app-shell/nav-dropdown';
import {
    ActivationAlert,
    FollowStats,
    UserInfo,
    UserTitle,
} from '@/features/users';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { USER_NAV_ROUTES } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute('/_pages/u/$username')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { username } = params;

        if (UUID_RE.test(username)) {
            const user = await ensureOr404(
                queryClient.ensureQueryData(
                    userReferenceOptions({
                        path: { reference: username },
                        client: apiClient,
                    }),
                ),
            );

            if (!user.username) throw notFound();

            throw redirect({
                to: '/u/$username',
                params: { username: user.username },
            });
        }

        const user = await ensureOr404(
            queryClient.ensureQueryData(
                userProfileOptions({
                    path: { username },
                    client: apiClient,
                }),
            ),
        );

        await Promise.allSettled([
            queryClient.prefetchQuery(
                userReadStatsOptions({
                    path: {
                        username,
                        content_type: ContentTypeEnum.MANGA,
                    },
                    client: apiClient,
                }),
            ),
            queryClient.prefetchQuery(
                userReadStatsOptions({
                    path: {
                        username,
                        content_type: ContentTypeEnum.NOVEL,
                    },
                    client: apiClient,
                }),
            ),
            queryClient.prefetchQuery(
                userWatchStatsOptions({
                    path: { username },
                    client: apiClient,
                }),
            ),
            queryClient.prefetchQuery(
                followStatsOptions({
                    path: { username },
                    client: apiClient,
                }),
            ),
        ]);

        return { user };
    },
    head: ({ loaderData }) => {
        const user = loaderData?.user;
        if (!user) return {};

        return generateHeadMeta({
            title: user.username ?? '',
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
        <div className="flex flex-col gap-8">
            <ActivationAlert />
            <CoverImage cover={user?.cover ?? undefined} />
            <Breadcrumbs>
                <Link
                    to={`/u/${username}`}
                    className="line-clamp-1 break-all font-bold text-sm hover:underline"
                >
                    {username}
                </Link>
                <NavMenu
                    routes={USER_NAV_ROUTES}
                    urlPrefix={`/u/${username}`}
                />
            </Breadcrumbs>
            <div className="flex flex-col gap-4 md:flex-row lg:items-end lg:gap-8">
                <div className="flex flex-1 gap-4 lg:gap-8">
                    <UserInfo />
                    <UserTitle />
                </div>
                <FollowStats />
            </div>
            <div className="flex flex-col gap-8">
                <Outlet />
            </div>
        </div>
    );
}
