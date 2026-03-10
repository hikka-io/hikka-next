import { createFileRoute } from '@tanstack/react-router';

import { PersonManga as Manga } from '@/features/people';

export const Route = createFileRoute('/_pages/people/$slug/manga')({
    head: () => ({
        meta: [{ title: 'Манґа' }],
    }),
    component: PersonMangaPage,
});

function PersonMangaPage() {
    return (
        <div className="flex flex-col gap-12">
            <Manga extended />
        </div>
    );
}
