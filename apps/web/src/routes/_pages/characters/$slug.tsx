import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import {
    entityDetailHead,
    loadEntityDetail,
} from '@/features/content/detail-route';
import { useTitle } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';

export const Route = createFileRoute('/_pages/characters/$slug')({
    loader: ({ params, context }) =>
        loadEntityDetail(ContentTypeEnum.CHARACTER, params.slug, context),
    head: ({ loaderData }) =>
        entityDetailHead(ContentTypeEnum.CHARACTER, loaderData),
    component: CharacterDetailLayout,
});

function CharacterDetailLayout() {
    const { slug } = Route.useParams();
    const { data: character } = useQuery(
        contentInfoOptions(ContentTypeEnum.CHARACTER, slug),
    );
    const title = useTitle(character);

    return (
        <ContentDetailLayout
            slug={character?.slug ?? slug}
            contentType={ContentTypeEnum.CHARACTER}
            title={title}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
