import { createFileRoute } from '@tanstack/react-router';

import { PersonCharacters as Characters } from '@/features/people';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/characters')({
    head: () => generateHeadMeta({ title: 'Персонажі', robots: { index: false } }),
    component: PersonCharactersPage,
});

function PersonCharactersPage() {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
}
