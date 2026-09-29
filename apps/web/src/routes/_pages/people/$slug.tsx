import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailLayout } from '@/features/content';
import {
    entityDetailHead,
    loadEntityDetail,
} from '@/features/content/detail-route';
import { PERSON_NAV_ROUTES } from '@/features/entities';
import { useTitle } from '@/services/session';

export const Route = createFileRoute('/_pages/people/$slug')({
    loader: ({ params, context }) =>
        loadEntityDetail(ContentTypeEnum.PERSON, {
            slug: params.slug,
            ...context,
        }),
    head: ({ loaderData }) =>
        entityDetailHead(ContentTypeEnum.PERSON, loaderData),
    component: PersonDetailLayout,
});

function PersonDetailLayout() {
    const { person } = Route.useLoaderData();
    const title = useTitle(person);

    return (
        <ContentDetailLayout
            slug={person.slug}
            contentType={ContentTypeEnum.PERSON}
            navRoutes={PERSON_NAV_ROUTES}
            title={title}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
