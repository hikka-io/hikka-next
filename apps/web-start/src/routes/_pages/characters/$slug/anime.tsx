import { createFileRoute } from '@tanstack/react-router';

import { CharacterAnime as Anime } from '@/features/characters';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/anime')({
    head: () => generateHeadMeta({ title: 'Аніме', robots: { index: false } }),
    component: CharacterAnimePage,
});

function CharacterAnimePage() {
    return (
        <div className="flex flex-col gap-12">
            <Anime extended />
        </div>
    );
}
