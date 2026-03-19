import { createFileRoute } from '@tanstack/react-router';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/')({
    head: () =>
        generateHeadMeta({
            title: 'Персонажі',
            description: 'Каталог персонажів аніме, манґи та ранобе на Hikka',
            url: 'https://hikka.io/characters',
        }),
    component: CharactersListPage,
});

function CharactersListPage() {
    return null;
}
