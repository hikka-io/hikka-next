import { ContentTypeEnum } from '@hikka/client';
import {
    contentCommentsOptions,
    favouriteStatusOptions,
    franchiseOptions,
    mangaBySlugOptions,
    mangaCharactersOptions,
    readBySlugOptions,
    readingUsersOptions,
    searchArticlesOptions,
    searchCollectionsOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { MANGA_NAV_ROUTES } from '@/utils/constants/navigation';
import { getNsfwConsentFn } from '@/utils/cookies/server';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/manga/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const manga = await queryClient.ensureQueryData(
            mangaBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!manga) throw redirect({ to: '/' });

        const nsfwConsented = manga.nsfw
            ? !!(await getNsfwConsentFn())
            : false;

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData(
                mangaCharactersOptions(hikkaClient, {
                    slug: params.slug,
                    paginationArgs: { size: 20, page: 1 },
                }),
            ),
            queryClient.ensureQueryData(
                franchiseOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.ensureQueryData(
                readBySlugOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                readingUsersOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.ensureQueryData(
                favouriteStatusOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.MANGA,
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                searchArticlesOptions(hikkaClient, {
                    args: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.MANGA,
                    },
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                contentCommentsOptions(hikkaClient, {
                    contentType: ContentTypeEnum.MANGA,
                    slug: params.slug,
                    paginationArgs: { size: 3 },
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                searchCollectionsOptions(hikkaClient, {
                    args: {
                        content: [params.slug],
                        content_type: ContentTypeEnum.MANGA,
                    },
                }),
            ),
        ]);

        return { manga, nsfwConsented };
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
            title,
            description: synopsis,
            image: `${import.meta.env.VITE_SITE_URL || 'https://hikka.io'}/api/og/manga?slug=${manga.slug}&v=${manga.updated}`,
            imageWidth: 1200,
            imageHeight: 630,
            imageType: 'image/jpeg',
            url: `https://hikka.io/manga/${manga.slug}`,
            other: {
                ...(manga.mal_id ? { 'mal-id': manga.mal_id } : {}),
            },
            robots: { index: !manga.nsfw },
        });
    },
    component: MangaDetailLayout,
});

function MangaDetailLayout() {
    const { manga, nsfwConsented } = Route.useLoaderData();

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
            nsfw={manga.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
