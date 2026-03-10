import { createFileRoute } from '@tanstack/react-router';

import { AnimeList } from '@/features/anime';

export const Route = createFileRoute('/_pages/anime/')({
    head: () => ({
        meta: [{ title: 'Аніме / Hikka' }],
    }),
    component: AnimeListPage,
});

function AnimeListPage() {
    return <AnimeList />;
}
