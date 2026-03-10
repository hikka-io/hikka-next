import { createFileRoute } from '@tanstack/react-router';

import { CharacterVoices as Voices } from '@/features/characters';

export const Route = createFileRoute('/_pages/characters/$slug/voices')({
    head: () => ({
        meta: [{ title: 'Сейю' }],
    }),
    component: CharacterVoicesPage,
});

function CharacterVoicesPage() {
    return (
        <div className="flex flex-col gap-12">
            <Voices extended />
        </div>
    );
}
