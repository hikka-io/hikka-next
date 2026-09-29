import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { ContentDetailLayout } from '@/features/content';
import {
    entityDetailHead,
    loadEntityDetail,
} from '@/features/content/detail-route';
import { CHARACTER_NAV_ROUTES } from '@/features/entities';

export const Route = createFileRoute('/_pages/characters/$slug')({
    loader: ({ params, context }) =>
        loadEntityDetail(ContentTypeEnum.CHARACTER, {
            slug: params.slug,
            ...context,
        }),
    head: ({ loaderData }) =>
        entityDetailHead(ContentTypeEnum.CHARACTER, loaderData),
    component: CharacterDetailLayout,
});

function CharacterDetailLayout() {
    const { character } = Route.useLoaderData();
    const title = useTitle(character);

    return (
        <ContentDetailLayout
            slug={character.slug}
            contentType={ContentTypeEnum.CHARACTER}
            navRoutes={CHARACTER_NAV_ROUTES}
            title={title}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
