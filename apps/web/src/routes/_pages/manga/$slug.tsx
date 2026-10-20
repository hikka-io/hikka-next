import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';
import { contentDetailSearchSchema } from '@hikka/core';

import { ContentDetailLayout } from '@/features/content';
import {
    contentDetailHead,
    contentDetailTitle,
    loadContentDetail,
} from '@/features/content/detail-route';
import { contentInfoOptions } from '@/utils/api/content-queries';

export const Route = createFileRoute('/_pages/manga/$slug')({
    validateSearch: zodValidator(contentDetailSearchSchema),
    loader: ({ params, context }) =>
        loadContentDetail(ContentTypeEnum.MANGA, params.slug, context),
    head: ({ loaderData }) =>
        contentDetailHead(ContentTypeEnum.MANGA, loaderData),
    component: MangaDetailLayout,
});

function MangaDetailLayout() {
    const { slug } = Route.useParams();
    const { nsfwConsented } = Route.useLoaderData();
    const { data: manga } = useQuery(
        contentInfoOptions(ContentTypeEnum.MANGA, slug),
    );

    return (
        <ContentDetailLayout
            slug={manga?.slug ?? slug}
            contentType={ContentTypeEnum.MANGA}
            title={
                manga ? contentDetailTitle(ContentTypeEnum.MANGA, manga) : ''
            }
            nsfw={manga?.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
