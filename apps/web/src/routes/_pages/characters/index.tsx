import { createFileRoute } from '@tanstack/react-router';

import { generateHeadMeta } from '@/utils/metadata';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/characters/')({
    head: () =>
        generateHeadMeta({
            title: 'Персонажі',
            description: 'Каталог персонажів аніме, манґи та ранобе на Hikka',
            url: `${SITE_ORIGIN}/characters`,
        }),
    component: CharactersListPage,
});

function CharactersListPage() {
    return null;
}
