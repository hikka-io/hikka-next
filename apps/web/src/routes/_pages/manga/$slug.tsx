import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import {
    contentDetailHead,
    contentDetailTitle,
    loadContentDetail,
} from '@/features/content/detail-route';

export const Route = createFileRoute('/_pages/manga/$slug')({
    loader: ({ params, context }) =>
        loadContentDetail(ContentTypeEnum.MANGA, params.slug, context),
    head: ({ loaderData }) =>
        contentDetailHead(ContentTypeEnum.MANGA, loaderData),
    component: MangaDetailLayout,
});

function MangaDetailLayout() {
    const { manga, nsfwConsented } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={manga.slug}
            contentType={ContentTypeEnum.MANGA}
            title={contentDetailTitle(ContentTypeEnum.MANGA, manga)}
            nsfw={manga.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
