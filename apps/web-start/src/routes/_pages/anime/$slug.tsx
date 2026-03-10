import { ContentTypeEnum } from '@hikka/client';
import {
    animeBySlugOptions,
    animeCharactersOptions,
    animeStaffOptions,
    favouriteStatusOptions,
    franchiseOptions,
    watchBySlugOptions,
    watchingUsersOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { ANIME_NAV_ROUTES } from '@/utils/constants/navigation';

export const Route = createFileRoute('/_pages/anime/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const anime = await queryClient.ensureQueryData(
            animeBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!anime) throw redirect({ to: '/' });

        await Promise.all([
            queryClient.ensureInfiniteQueryData(
                animeCharactersOptions(hikkaClient, { slug: params.slug }) as any,
            ),
            queryClient.ensureInfiniteQueryData(
                franchiseOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.ANIME,
                }) as any,
            ),
            queryClient.ensureInfiniteQueryData(
                animeStaffOptions(hikkaClient, { slug: params.slug }) as any,
            ),
            queryClient.prefetchQuery(
                watchBySlugOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.prefetchQuery(
                favouriteStatusOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.ANIME,
                }),
            ),
            queryClient.prefetchInfiniteQuery(
                watchingUsersOptions(hikkaClient, { slug: params.slug }) as any,
            ),
        ]);

        return { anime };
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                title:
                    loaderData?.anime?.title_ua ||
                    loaderData?.anime?.title_en ||
                    loaderData?.anime?.title_ja ||
                    '',
            },
            {
                name: 'description',
                content:
                    loaderData?.anime?.synopsis_ua ||
                    loaderData?.anime?.synopsis_en ||
                    '',
            },
        ],
    }),
    component: AnimeDetailLayout,
});

function AnimeDetailLayout() {
    const { anime } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={anime.slug}
            contentType={ContentTypeEnum.ANIME}
            navRoutes={ANIME_NAV_ROUTES}
            urlPrefix="/anime"
            title={anime.title_ua || anime.title_en || anime.title_ja || ''}
            status={anime.status}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
