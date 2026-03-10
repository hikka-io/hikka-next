import { ContentTypeEnum } from '@hikka/client';
import {
    ensureInfiniteQueryData,
    prefetchInfiniteQuery,
} from '@hikka/react/core';
import {
    favouriteStatusOptions,
    franchiseOptions,
    mangaBySlugOptions,
    mangaCharactersOptions,
    readBySlugOptions,
    readingUsersOptions,
    searchArticlesOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { MANGA_NAV_ROUTES } from '@/utils/constants/navigation';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/manga/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const manga = await queryClient.ensureQueryData(
            mangaBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!manga) throw redirect({ to: '/' });

        await Promise.all([
            ensureInfiniteQueryData(
                queryClient,
                mangaCharactersOptions(hikkaClient, { slug: params.slug }),
            ),
            ensureInfiniteQueryData(
                queryClient,
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
            prefetchInfiniteQuery(queryClient, readingUsersOptions(hikkaClient, {
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
            prefetchInfiniteQuery(
                queryClient,
                searchArticlesOptions(hikkaClient, {
                    args: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.MANGA,
                    },
                }),
            ),
        ]);

        return { manga };
    },
    head: ({ loaderData }) => {
        const manga = loaderData?.manga;
        if (!manga) return {};

        const startDate = manga.start_date
            ? new Date(manga.start_date * 1000).getFullYear()
            : null;
        const title =
            (manga.title_ua || manga.title_en || manga.title_original || '') +
            (startDate ? ` (${startDate})` : '');
        const synopsis = truncateText(
            parseTextFromMarkDown(manga.synopsis_ua || manga.synopsis_en || ''),
            150,
            true,
        );

        return generateHeadMeta({
            title: { default: title, template: `%s / ${title} / Hikka` },
            description: synopsis,
            image: `https://preview.hikka.io/manga/${manga.slug}/${manga.updated}`,
            other: {
                ...(manga.mal_id ? { 'mal-id': manga.mal_id } : {}),
            },
            robots: { index: !manga.nsfw },
        });
    },
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
