import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/characters/')({
    head: () => ({
        meta: [{ title: 'Персонажі / Hikka' }],
    }),
    component: CharactersListPage,
});

function CharactersListPage() {
    return null;
}
