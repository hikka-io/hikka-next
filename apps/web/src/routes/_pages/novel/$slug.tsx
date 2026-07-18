import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    contentFranchiseOptions,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    getCommentsListInfiniteOptions,
    getFavouriteOptions,
    getReadFollowingInfiniteOptions,
    novelCharactersInfiniteOptions,
    novelInfoOptions,
    paginationPageParam,
    ReadContentTypeEnum,
    RelatedContentTypeEnum,
    readGetOptions,
} from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { NOVEL_NAV_ROUTES } from '@/utils/constants/navigation';
import { stripRestrictedExternal } from '@/utils/content/strip-restricted-external';
import { getAuthTokenFn } from '@/utils/cookies';
import { getNsfwConsentFn } from '@/utils/cookies/server';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/novel/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const novelOptions = novelInfoOptions({
            path: { slug: params.slug },
            client: apiClient,
        });
        let novel = await ensureOr404(
            queryClient.ensureQueryData(novelOptions),
        );

        if (!novel) throw notFound();

        const authToken = await getAuthTokenFn();

        if (!authToken) {
            novel = stripRestrictedExternal(novel);
            queryClient.setQueryData(novelOptions.queryKey, novel);
        }

        const nsfwConsented = novel.nsfw ? !!(await getNsfwConsentFn()) : false;

        const prefetches: Promise<unknown>[] = [
            // Match the component-body call (no `query`) to share a cache key.
            queryClient.ensureInfiniteQueryData({
                ...novelCharactersInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureQueryData(
                contentFranchiseOptions({
                    path: {
                        slug: params.slug,
                        content_type: RelatedContentTypeEnum.NOVEL,
                    },
                    client: apiClient,
                }),
            ),
            queryClient.ensureInfiniteQueryData({
                ...getArticlesInfiniteOptions({
                    body: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.NOVEL,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...getCommentsListInfiniteOptions({
                    path: {
                        content_type: ContentTypeEnum.NOVEL,
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
                        content_type: ContentTypeEnum.NOVEL,
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
                            content_type: ReadContentTypeEnum.NOVEL,
                        },
                        client: apiClient,
                    }),
                ),
                queryClient.ensureQueryData(
                    getFavouriteOptions({
                        path: {
                            slug: params.slug,
                            content_type: ContentTypeEnum.NOVEL,
                        },
                        client: apiClient,
                    }),
                ),
                queryClient.ensureInfiniteQueryData({
                    ...getReadFollowingInfiniteOptions({
                        path: {
                            slug: params.slug,
                            content_type: ReadContentTypeEnum.NOVEL,
                        },
                        client: apiClient,
                    }),
                    ...paginationPageParam(),
                }),
            );
        }

        await Promise.allSettled(prefetches);

        return { novel, nsfwConsented };
    },
    head: ({ loaderData }) => {
        const novel = loaderData?.novel;
        if (!novel) return {};

        const startDate = novel.start_date
            ? new Date(novel.start_date * 1000).getFullYear()
            : null;
        const title =
            (novel.title_ua || novel.title_en || novel.title_original || '') +
            (startDate ? ` (${startDate})` : '');
        const synopsis = truncateText(
            parseTextFromMarkDown(novel.synopsis_ua || novel.synopsis_en || ''),
            150,
            true,
        );

        return generateHeadMeta({
            title,
            description: synopsis,
            image: `${import.meta.env.VITE_SITE_URL || 'https://hikka.io'}/api/og/novel?slug=${novel.slug}&v=${novel.updated}`,
            imageWidth: 1200,
            imageHeight: 630,
            imageType: 'image/jpeg',
            url: `https://hikka.io/novel/${novel.slug}`,
            other: {
                ...(novel.mal_id ? { 'mal-id': novel.mal_id } : {}),
            },
            robots: { index: !novel.nsfw },
        });
    },
    component: NovelDetailLayout,
});

function NovelDetailLayout() {
    const { novel, nsfwConsented } = Route.useLoaderData();

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
            nsfw={novel.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
