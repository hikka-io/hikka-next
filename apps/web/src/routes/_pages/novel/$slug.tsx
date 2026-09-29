import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import {
    contentDetailHead,
    contentDetailTitle,
    loadContentDetail,
} from '@/features/content/detail-route';

export const Route = createFileRoute('/_pages/novel/$slug')({
    loader: ({ params, context }) =>
        loadContentDetail(ContentTypeEnum.NOVEL, {
            slug: params.slug,
            ...context,
        }),
    head: ({ loaderData }) =>
        contentDetailHead(ContentTypeEnum.NOVEL, loaderData),
    component: NovelDetailLayout,
});

function NovelDetailLayout() {
    const { novel, nsfwConsented } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={novel.slug}
            contentType={ContentTypeEnum.NOVEL}
            title={contentDetailTitle(ContentTypeEnum.NOVEL, novel)}
            nsfw={novel.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
