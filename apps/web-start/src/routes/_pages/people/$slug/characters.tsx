import { createFileRoute } from '@tanstack/react-router';

import { PersonCharacters as Characters } from '@/features/people';

export const Route = createFileRoute('/_pages/people/$slug/characters')({
    head: () => ({
        meta: [{ title: 'Персонажі' }],
    }),
    component: PersonCharactersPage,
});

function PersonCharactersPage() {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
}
