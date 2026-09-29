import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import {
    contentDetailHead,
    contentDetailTitle,
    loadContentDetail,
} from '@/features/content/detail-route';

export const Route = createFileRoute('/_pages/anime/$slug')({
    loader: ({ params, context }) =>
        loadContentDetail(ContentTypeEnum.ANIME, {
            slug: params.slug,
            ...context,
        }),
    head: ({ loaderData }) =>
        contentDetailHead(ContentTypeEnum.ANIME, loaderData),
    component: AnimeDetailLayout,
});

function AnimeDetailLayout() {
    const { anime, nsfwConsented } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={anime.slug}
            contentType={ContentTypeEnum.ANIME}
            title={contentDetailTitle(ContentTypeEnum.ANIME, anime)}
            nsfw={anime.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
