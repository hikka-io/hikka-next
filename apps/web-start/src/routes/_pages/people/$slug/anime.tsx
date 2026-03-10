import { createFileRoute } from '@tanstack/react-router';

import { PersonAnime as Anime } from '@/features/people';

export const Route = createFileRoute('/_pages/people/$slug/anime')({
    head: () => ({
        meta: [{ title: 'Аніме' }],
    }),
    component: PersonAnimePage,
});

function PersonAnimePage() {
    return (
        <div className="flex flex-col gap-12">
            <Anime extended />
        </div>
    );
}
