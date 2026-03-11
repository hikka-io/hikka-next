import { createFileRoute } from '@tanstack/react-router';

import { PersonAnime as Anime } from '@/features/people';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/anime')({
    head: () => generateHeadMeta({ title: 'Аніме', robots: { index: false } }),
    component: PersonAnimePage,
});

function PersonAnimePage() {
    return (
        <div className="flex flex-col gap-12">
            <Anime extended />
        </div>
    );
}
