import { createFileRoute } from '@tanstack/react-router';

import { CharacterVoices as Voices } from '@/features/characters';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/voices')({
    head: () => generateHeadMeta({ title: 'Сейю', robots: { index: false } }),
    component: CharacterVoicesPage,
});

function CharacterVoicesPage() {
    return (
        <div className="flex flex-col gap-12">
            <Voices extended />
        </div>
    );
}
