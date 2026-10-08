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

export const Route = createFileRoute('/_pages/anime/$slug')({
    loader: ({ params, context }) =>
        loadContentDetail(ContentTypeEnum.ANIME, params.slug, context),
    head: ({ loaderData }) =>
        contentDetailHead(ContentTypeEnum.ANIME, loaderData),
    component: AnimeDetailLayout,
});

function AnimeDetailLayout() {
    const { slug } = Route.useParams();
    const { nsfwConsented } = Route.useLoaderData();
    const { data: anime } = useQuery(
        contentInfoOptions(ContentTypeEnum.ANIME, slug),
    );

    return (
        <ContentDetailLayout
            slug={anime?.slug ?? slug}
            contentType={ContentTypeEnum.ANIME}
            title={
                anime ? contentDetailTitle(ContentTypeEnum.ANIME, anime) : ''
            }
            nsfw={anime?.nsfw}
            nsfwConsented={nsfwConsented}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
