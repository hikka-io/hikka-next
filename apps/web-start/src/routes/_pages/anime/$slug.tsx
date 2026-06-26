import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import {
    animeCharactersInfiniteOptions,
    animeSlugOptions,
    animeStaffInfiniteOptions,
    ContentTypeEnum,
    contentFranchiseOptions,
    getArticlesInfiniteOptions,
    getContentsListInfiniteOptions,
    getCollectionsInfiniteOptions,
    getFavouriteOptions,
    getWatchFollowingInfiniteOptions,
    paginationPageParam,
    RelatedContentTypeEnum,
    watchGetOptions,
} from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import { ANIME_NAV_ROUTES } from '@/utils/constants/navigation';
import { getAuthTokenFn } from '@/utils/cookies';
import { stripRestrictedExternal } from '@/utils/content/strip-restricted-external';
import { getNsfwConsentFn } from '@/utils/cookies/server';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/anime/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const animeOptions = animeSlugOptions({
            path: { slug: params.slug },
            client: apiClient,
        });
        let anime = await queryClient.ensureQueryData(animeOptions);

        if (!anime) throw redirect({ to: '/' });

        if (!(await getAuthTokenFn())) {
            // TODO(phase2): drop cast once stripRestrictedExternal reads @hikka/api types
            anime = stripRestrictedExternal(
                anime as unknown as Parameters<
                    typeof stripRestrictedExternal
                >[0],
            ) as unknown as typeof anime;
            queryClient.setQueryData(animeOptions.queryKey, anime);
        }

        const nsfwConsented = anime.nsfw ? !!(await getNsfwConsentFn()) : false;

        await Promise.allSettled([
            queryClient.ensureQueryData(
                contentFranchiseOptions({
                    path: {
                        slug: params.slug,
                        content_type: RelatedContentTypeEnum.ANIME,
                    },
                    client: apiClient,
                }),
            ),
            queryClient.ensureInfiniteQueryData({
                ...animeStaffInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureQueryData(
                watchGetOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
            ),
            queryClient.ensureQueryData(
                getFavouriteOptions({
                    path: {
                        slug: params.slug,
                        content_type: ContentTypeEnum.ANIME,
                    },
                    client: apiClient,
                }),
            ),
            queryClient.ensureInfiniteQueryData({
                ...getWatchFollowingInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...getArticlesInfiniteOptions({
                    body: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.ANIME,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...getContentsListInfiniteOptions({
                    path: {
                        content_type: ContentTypeEnum.ANIME,
                        slug: params.slug,
                    },
                    query: { size: 3 },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...animeCharactersInfiniteOptions({
                    path: { slug: params.slug },
                    query: { size: 20, page: 1 },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...getCollectionsInfiniteOptions({
                    body: {
                        content: [params.slug],
                        content_type: ContentTypeEnum.ANIME,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
        ]);

        return { anime, nsfwConsented };
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
            imageType: 'image/jpeg',
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
    const { anime, nsfwConsented } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={anime.slug}
            contentType={ContentTypeEnum.ANIME}
            navRoutes={ANIME_NAV_ROUTES}
            urlPrefix="/anime"
            title={anime.title_ua || anime.title_en || anime.title_ja || ''}
            status={anime.status}
            nsfw={anime.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
