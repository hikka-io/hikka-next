import { ContentTypeEnum } from '@hikka/client';
import {
    favouriteStatusOptions,
    franchiseOptions,
    novelBySlugOptions,
    novelCharactersOptions,
    readBySlugOptions,
    readingUsersOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { NOVEL_NAV_ROUTES } from '@/utils/constants/navigation';

export const Route = createFileRoute('/_pages/novel/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const novel = await queryClient.ensureQueryData(
            novelBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!novel) throw redirect({ to: '/' });

        await Promise.all([
            queryClient.ensureQueryData(
                novelCharactersOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                franchiseOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.prefetchQuery(
                readBySlugOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.prefetchQuery(
                readingUsersOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.prefetchQuery(
                favouriteStatusOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
        ]);

        return { novel };
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                title:
                    loaderData?.novel?.title_ua ||
                    loaderData?.novel?.title_en ||
                    loaderData?.novel?.title_original ||
                    '',
            },
            {
                name: 'description',
                content:
                    loaderData?.novel?.synopsis_ua ||
                    loaderData?.novel?.synopsis_en ||
                    '',
            },
        ],
    }),
    component: NovelDetailLayout,
});

function NovelDetailLayout() {
    const { novel } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={novel.slug}
            contentType={ContentTypeEnum.NOVEL}
            navRoutes={NOVEL_NAV_ROUTES}
            urlPrefix="/novel"
            title={
                novel.title_ua || novel.title_en || novel.title_original || ''
            }
            status={novel.status}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
