import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { CharacterDetailPage } from '@/features/entities';
import { loadEntityOverview } from '@/features/entities/queries';

export const Route = createFileRoute('/_pages/characters/$slug/')({
    loader: ({ params, context }) =>
        loadEntityOverview(ContentTypeEnum.CHARACTER, params.slug, context),
    component: CharacterPage,
});

function CharacterPage() {
    const { slug } = Route.useParams();

    return <CharacterDetailPage slug={slug} />;
}
