import {
    createFileRoute,
    notFound,
    Outlet,
    redirect,
} from '@tanstack/react-router';

import {
    ContentTypeEnum,
    followStatsOptions,
    serviceUserStatsOptions,
    userProfileOptions,
    userReadStatsOptions,
    userReferenceOptions,
    userWatchStatsOptions,
} from '@hikka/api';

import CoverImage from '@/components/cover-image';
import { usePageHeader } from '@/features/app-shell';
import {
    ActivationAlert,
    FollowStats,
    UserInfo,
    UserlistHeaderFilters,
    UserTitle,
} from '@/features/users';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { USER_NAV_ROUTES } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';
import { usePathname } from '@/utils/navigation';

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
            queryClient.prefetchQuery(
                serviceUserStatsOptions({
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
    const pathname = usePathname();
    const profileUrl = `/u/${username}`;

    const isListRoute = pathname.startsWith(`${profileUrl}/list/`);

    usePageHeader({
        title: username,
        parent: pathname === profileUrl ? '/' : profileUrl,
        navRoutes: USER_NAV_ROUTES,
        navUrlPrefix: profileUrl,
        anchored: true,
        actionsAnchored: true,
        actionsComponent: isListRoute ? UserlistHeaderFilters : undefined,
    });

    return (
        <div className="flex flex-col gap-8">
            <ActivationAlert />
            <CoverImage cover={user?.cover ?? undefined} />
            <div className="flex flex-col gap-4 md:flex-row lg:items-end lg:gap-8">
                <div className="flex min-w-0 flex-1 gap-4 lg:gap-8">
                    <UserInfo />
                    <UserTitle />
                </div>
                <FollowStats className="shrink-0" />
            </div>
            <div className="flex flex-col gap-8">
                <Outlet />
            </div>
        </div>
    );
}
