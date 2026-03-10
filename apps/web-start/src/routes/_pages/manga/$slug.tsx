import { ContentTypeEnum } from '@hikka/client';
import {
    favouriteStatusOptions,
    franchiseOptions,
    mangaBySlugOptions,
    mangaCharactersOptions,
    readBySlugOptions,
    readingUsersOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { MANGA_NAV_ROUTES } from '@/utils/constants/navigation';

export const Route = createFileRoute('/_pages/manga/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const manga = await queryClient.ensureQueryData(
            mangaBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!manga) throw redirect({ to: '/' });

        await Promise.all([
            queryClient.ensureQueryData(
                mangaCharactersOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                franchiseOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.prefetchQuery(
                readBySlugOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.prefetchQuery(
                readingUsersOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.prefetchQuery(
                favouriteStatusOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
        ]);

        return { manga };
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                title:
                    loaderData?.manga?.title_ua ||
                    loaderData?.manga?.title_en ||
                    loaderData?.manga?.title_original ||
                    '',
            },
            {
                name: 'description',
                content:
                    loaderData?.manga?.synopsis_ua ||
                    loaderData?.manga?.synopsis_en ||
                    '',
            },
        ],
    }),
    component: MangaDetailLayout,
});

function MangaDetailLayout() {
    const { manga } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={manga.slug}
            contentType={ContentTypeEnum.MANGA}
            navRoutes={MANGA_NAV_ROUTES}
            urlPrefix="/manga"
            title={
                manga.title_ua || manga.title_en || manga.title_original || ''
            }
            status={manga.status}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
