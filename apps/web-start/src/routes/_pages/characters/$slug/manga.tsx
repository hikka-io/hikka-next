import { createFileRoute } from '@tanstack/react-router';

import { CharacterManga as Manga } from '@/features/characters';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/manga')({
    head: () => generateHeadMeta({ title: 'Манґа', robots: { index: false } }),
    component: CharacterMangaPage,
});

function CharacterMangaPage() {
    return (
        <div className="flex flex-col gap-12">
            <Manga extended />
        </div>
    );
}
