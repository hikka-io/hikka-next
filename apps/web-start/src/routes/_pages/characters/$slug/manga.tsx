import { createFileRoute } from '@tanstack/react-router';

import { CharacterManga as Manga } from '@/features/characters';

export const Route = createFileRoute('/_pages/characters/$slug/manga')({
    head: () => ({
        meta: [{ title: 'Манґа' }],
    }),
    component: CharacterMangaPage,
});

function CharacterMangaPage() {
    return (
        <div className="flex flex-col gap-12">
            <Manga extended />
        </div>
    );
}
