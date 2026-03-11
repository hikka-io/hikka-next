import { createFileRoute } from '@tanstack/react-router';

import { PersonManga as Manga } from '@/features/people';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/manga')({
    head: () => generateHeadMeta({ title: 'Манґа', robots: { index: false } }),
    component: PersonMangaPage,
});

function PersonMangaPage() {
    return (
        <div className="flex flex-col gap-12">
            <Manga extended />
        </div>
    );
}
