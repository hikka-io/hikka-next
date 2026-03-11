import { createFileRoute } from '@tanstack/react-router';

import { CharacterNovel as Novel } from '@/features/characters';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/novel')({
    head: () => generateHeadMeta({ title: 'Ранобе', robots: { index: false } }),
    component: CharacterNovelPage,
});

function CharacterNovelPage() {
    return (
        <div className="flex flex-col gap-12">
            <Novel extended />
        </div>
    );
}
