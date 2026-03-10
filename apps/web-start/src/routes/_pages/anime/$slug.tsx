import { ContentTypeEnum } from '@hikka/client';
import {
    animeBySlugOptions,
    animeCharactersOptions,
    animeStaffOptions,
    favouriteStatusOptions,
    franchiseOptions,
    searchArticlesOptions,
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
            queryClient.prefetchInfiniteQuery(
                searchArticlesOptions(hikkaClient, {
                    args: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.ANIME,
                    },
                }) as any,
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
            title: { default: title, template: `%s / ${title} / Hikka` },
            description: synopsis,
            image: `https://preview.hikka.io/anime/${anime.slug}/${anime.updated}`,
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
