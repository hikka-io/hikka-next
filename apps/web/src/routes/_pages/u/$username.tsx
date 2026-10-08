import { useQuery } from '@tanstack/react-query';
import {
    createFileRoute,
    notFound,
    Outlet,
    redirect,
} from '@tanstack/react-router';

import {
    followStatsOptions,
    userProfileOptions,
    userReferenceOptions,
} from '@hikka/api';

import { CoverImage, usePageHeader } from '@/features/app-shell';
import {
    ActivationAlert,
    FollowStats,
    USER_NAV_ROUTES,
    UserAvatar,
    UserListHeaderFilters,
    UserTitle,
} from '@/features/users';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { isUserReference } from '@/utils/mentions';
import { generateHeadMeta } from '@/utils/metadata';
import { usePathname } from '@/utils/navigation';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/u/$username')({
    beforeLoad: async ({ params, context: { queryClient, apiClient } }) => {
        const { username } = params;

        if (!isUserReference(username)) return;

        const user = await ensureOr404(() =>
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
    },
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { username } = params;

        const [user] = await Promise.all([
            ensureOr404(() =>
                queryClient.ensureQueryData(
                    userProfileOptions({
                        path: { username },
                        client: apiClient,
                    }),
                ),
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
            url: `${SITE_ORIGIN}/u/${user.username}`,
        });
    },
    component: UserLayout,
});

function UserLayout() {
    const { username } = Route.useParams();
    const { data: user } = useQuery(userProfileOptions({ path: { username } }));
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
        actionsComponent: isListRoute ? UserListHeaderFilters : undefined,
    });

    return (
        <div className="flex flex-col gap-8">
            <ActivationAlert />
            <CoverImage cover={user?.cover ?? undefined} />
            <div className="flex flex-col gap-4 md:flex-row lg:items-end lg:gap-8">
                <div className="flex min-w-0 flex-1 gap-4 lg:gap-8">
                    <UserAvatar />
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
