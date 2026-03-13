import { ContentTypeEnum } from '@hikka/client';
import {
    animeBySlugOptions,
    animeCharactersOptions,
    animeStaffOptions,
    contentCommentsOptions,
    favouriteStatusOptions,
    franchiseOptions,
    searchArticlesOptions,
    searchCollectionsOptions,
    watchBySlugOptions,
    watchingUsersOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { ANIME_NAV_ROUTES } from '@/utils/constants/navigation';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/anime/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const anime = await queryClient.ensureQueryData(
            animeBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!anime) throw redirect({ to: '/' });

        await Promise.allSettled([
            queryClient.ensureQueryData(
                franchiseOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.ANIME,
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                animeStaffOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                watchBySlugOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                favouriteStatusOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.ANIME,
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                watchingUsersOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.prefetchInfiniteQuery(
                searchArticlesOptions(hikkaClient, {
                    args: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.ANIME,
                    },
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                contentCommentsOptions(hikkaClient, {
                    contentType: ContentTypeEnum.ANIME,
                    slug: params.slug,
                    paginationArgs: { size: 3 },
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                animeCharactersOptions(hikkaClient, {
                    slug: params.slug,
                    paginationArgs: { size: 20, page: 1 },
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                searchCollectionsOptions(hikkaClient, {
                    args: {
                        content: [params.slug],
                        content_type: ContentTypeEnum.ANIME,
                    },
                }),
            ),
        ]);

        return { anime };
    },
    head: ({ loaderData }) => {
        const anime = loaderData?.anime;
        if (!anime) return {};

        const startDate = anime.start_date
            ? new Date(anime.start_date * 1000).getFullYear()
            : null;
        const title =
            (anime.title_ua || anime.title_en || anime.title_ja || '') +
            (startDate ? ` (${startDate})` : '');
        const synopsis = truncateText(
            parseTextFromMarkDown(anime.synopsis_ua || anime.synopsis_en || ''),
            150,
            true,
        );

        return generateHeadMeta({
            title,
            description: synopsis,
            image: `${import.meta.env.VITE_SITE_URL || 'https://hikka.io'}/api/og/anime?slug=${anime.slug}&v=${anime.updated}`,
            imageWidth: 1200,
            imageHeight: 630,
            url: `https://hikka.io/anime/${anime.slug}`,
            other: {
                ...(anime.mal_id ? { 'mal-id': anime.mal_id } : {}),
            },
            robots: { index: !anime.nsfw },
        });
    },
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
