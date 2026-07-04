import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    contentFranchiseOptions,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    getContentsListInfiniteOptions,
    getFavouriteOptions,
    getReadFollowingInfiniteOptions,
    HikkaApiError,
    mangaCharactersInfiniteOptions,
    mangaInfoOptions,
    paginationPageParam,
    ReadContentTypeEnum,
    RelatedContentTypeEnum,
    readGetOptions,
} from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import { MANGA_NAV_ROUTES } from '@/utils/constants/navigation';
import { stripRestrictedExternal } from '@/utils/content/strip-restricted-external';
import { getAuthTokenFn } from '@/utils/cookies';
import { getNsfwConsentFn } from '@/utils/cookies/server';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/manga/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const mangaOptions = mangaInfoOptions({
            path: { slug: params.slug },
            client: apiClient,
        });
        let manga = await queryClient
            .ensureQueryData(mangaOptions)
            .catch((error) => {
                // Unknown slug: render not-found instead of bubbling to 500.
                if (error instanceof HikkaApiError && error.status === 404) {
                    throw notFound();
                }
                throw error;
            });

        if (!manga) throw notFound();

        const authToken = await getAuthTokenFn();

        if (!authToken) {
            manga = stripRestrictedExternal(manga);
            queryClient.setQueryData(mangaOptions.queryKey, manga);
        }

        const nsfwConsented = manga.nsfw ? !!(await getNsfwConsentFn()) : false;

        const prefetches: Promise<unknown>[] = [
            // Match the component-body call (no `query`) to share a cache key.
            queryClient.ensureInfiniteQueryData({
                ...mangaCharactersInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureQueryData(
                contentFranchiseOptions({
                    path: {
                        slug: params.slug,
                        content_type: RelatedContentTypeEnum.MANGA,
                    },
                    client: apiClient,
                }),
            ),
            queryClient.ensureInfiniteQueryData({
                ...getArticlesInfiniteOptions({
                    body: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.MANGA,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...getContentsListInfiniteOptions({
                    path: {
                        content_type: ContentTypeEnum.MANGA,
                        slug: params.slug,
                    },
                    query: { size: 3 },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...getCollectionsInfiniteOptions({
                    body: {
                        content: [params.slug],
                        content_type: ContentTypeEnum.MANGA,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
        ];

        // Only prefetch user-specific data when authed; anon just 401s.
        if (authToken) {
            prefetches.push(
                queryClient.ensureQueryData(
                    readGetOptions({
                        path: {
                            slug: params.slug,
                            content_type: ReadContentTypeEnum.MANGA,
                        },
                        client: apiClient,
                    }),
                ),
                queryClient.ensureQueryData(
                    getFavouriteOptions({
                        path: {
                            slug: params.slug,
                            content_type: ContentTypeEnum.MANGA,
                        },
                        client: apiClient,
                    }),
                ),
                queryClient.ensureInfiniteQueryData({
                    ...getReadFollowingInfiniteOptions({
                        path: {
                            slug: params.slug,
                            content_type: ReadContentTypeEnum.MANGA,
                        },
                        client: apiClient,
                    }),
                    ...paginationPageParam(),
                }),
            );
        }

        await Promise.allSettled(prefetches);

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
