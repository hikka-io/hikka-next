import { createFileRoute } from '@tanstack/react-router';

import { CharacterDetailPage } from '@/features/entities';

export const Route = createFileRoute('/_pages/characters/$slug/')({
    component: CharacterPage,
});

function CharacterPage() {
    const { slug } = Route.useParams();

    return <CharacterDetailPage slug={slug} />;
}
