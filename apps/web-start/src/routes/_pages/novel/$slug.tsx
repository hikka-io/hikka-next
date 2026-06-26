import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    contentFranchiseOptions,
    getArticlesInfiniteOptions,
    getContentsListInfiniteOptions,
    getCollectionsInfiniteOptions,
    getFavouriteOptions,
    getReadFollowingInfiniteOptions,
    novelCharactersInfiniteOptions,
    novelInfoOptions,
    paginationPageParam,
    ReadContentTypeEnum,
    readGetOptions,
    RelatedContentTypeEnum,
} from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import { NOVEL_NAV_ROUTES } from '@/utils/constants/navigation';
import { getAuthTokenFn } from '@/utils/cookies';
import { stripRestrictedExternal } from '@/utils/content/strip-restricted-external';
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
        let novel = await queryClient.ensureQueryData(novelOptions);

        if (!novel) throw redirect({ to: '/' });

        if (!(await getAuthTokenFn())) {
            // TODO(phase2): drop cast once stripRestrictedExternal reads @hikka/api types
            novel = stripRestrictedExternal(
                novel as unknown as Parameters<
                    typeof stripRestrictedExternal
                >[0],
            ) as unknown as typeof novel;
            queryClient.setQueryData(novelOptions.queryKey, novel);
        }

        const nsfwConsented = novel.nsfw ? !!(await getNsfwConsentFn()) : false;

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData({
                ...novelCharactersInfiniteOptions({
                    path: { slug: params.slug },
                    query: { size: 20, page: 1 },
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
            queryClient.ensureQueryData(
                readGetOptions({
                    path: {
                        slug: params.slug,
                        content_type: ReadContentTypeEnum.NOVEL,
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
                ...getContentsListInfiniteOptions({
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
        ]);

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
