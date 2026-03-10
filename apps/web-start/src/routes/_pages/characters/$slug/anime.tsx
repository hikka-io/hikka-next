import { createFileRoute } from '@tanstack/react-router';

import { CharacterAnime as Anime } from '@/features/characters';

export const Route = createFileRoute('/_pages/characters/$slug/anime')({
    head: () => ({
        meta: [{ title: 'Аніме' }],
    }),
    component: CharacterAnimePage,
});

function CharacterAnimePage() {
    return (
        <div className="flex flex-col gap-12">
            <Anime extended />
        </div>
    );
}
