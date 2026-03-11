import { ContentTypeEnum } from '@hikka/client';
import {
    favouriteStatusOptions,
    franchiseOptions,
    novelBySlugOptions,
    novelCharactersOptions,
    readBySlugOptions,
    readingUsersOptions,
    searchArticlesOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { NOVEL_NAV_ROUTES } from '@/utils/constants/navigation';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/novel/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const novel = await queryClient.ensureQueryData(
            novelBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!novel) throw redirect({ to: '/' });

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData(
                novelCharactersOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                franchiseOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.ensureQueryData(
                readBySlugOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                readingUsersOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.ensureQueryData(
                favouriteStatusOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.NOVEL,
                }),
            ),
            queryClient.ensureInfiniteQueryData(
                searchArticlesOptions(hikkaClient, {
                    args: {
                        content_slug: params.slug,
                        content_type: ContentTypeEnum.NOVEL,
                    },
                }),
            ),
        ]);

        return { novel };
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
            image: `https://preview.hikka.io/novel/${novel.slug}/${novel.updated}`,
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
    const { novel } = Route.useLoaderData();

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
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
