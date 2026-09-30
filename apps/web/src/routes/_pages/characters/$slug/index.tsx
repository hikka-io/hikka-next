import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { loadEntityOverview } from '@/features/content/detail-route';
import { CharacterDetailPage } from '@/features/entities';

export const Route = createFileRoute('/_pages/characters/$slug/')({
    loader: ({ params, context }) =>
        loadEntityOverview(ContentTypeEnum.CHARACTER, {
            slug: params.slug,
            ...context,
        }),
    component: CharacterPage,
});

function CharacterPage() {
    const { slug } = Route.useParams();

    return <CharacterDetailPage slug={slug} />;
}
