import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import {
    contentDetailHead,
    contentDetailTitle,
    loadContentDetail,
} from '@/features/content/detail-route';
import { contentInfoOptions } from '@/utils/api/content-queries';

export const Route = createFileRoute('/_pages/novel/$slug')({
    loader: ({ params, context }) =>
        loadContentDetail(ContentTypeEnum.NOVEL, params.slug, context),
    head: ({ loaderData }) =>
        contentDetailHead(ContentTypeEnum.NOVEL, loaderData),
    component: NovelDetailLayout,
});

function NovelDetailLayout() {
    const { slug } = Route.useParams();
    const { nsfwConsented } = Route.useLoaderData();
    const { data: novel } = useQuery(
        contentInfoOptions(ContentTypeEnum.NOVEL, slug),
    );

    return (
        <ContentDetailLayout
            slug={novel?.slug ?? slug}
            contentType={ContentTypeEnum.NOVEL}
            title={
                novel ? contentDetailTitle(ContentTypeEnum.NOVEL, novel) : ''
            }
            nsfw={novel?.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
