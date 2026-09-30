import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { PersonDetailPage } from '@/features/entities';
import { loadEntityOverview } from '@/features/entities/queries';

export const Route = createFileRoute('/_pages/people/$slug/')({
    loader: ({ params, context }) =>
        loadEntityOverview(ContentTypeEnum.PERSON, {
            slug: params.slug,
            ...context,
        }),
    component: PersonPage,
});

function PersonPage() {
    const { slug } = Route.useParams();

    return <PersonDetailPage slug={slug} />;
}
