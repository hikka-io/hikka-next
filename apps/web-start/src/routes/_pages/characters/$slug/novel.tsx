import { createFileRoute } from '@tanstack/react-router';

import { CharacterNovel as Novel } from '@/features/characters';

export const Route = createFileRoute('/_pages/characters/$slug/novel')({
    head: () => ({
        meta: [{ title: 'Ранобе' }],
    }),
    component: CharacterNovelPage,
});

function CharacterNovelPage() {
    return (
        <div className="flex flex-col gap-12">
            <Novel extended />
        </div>
    );
}
