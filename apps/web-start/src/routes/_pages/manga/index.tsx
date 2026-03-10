import { createFileRoute } from '@tanstack/react-router';

import { MangaList } from '@/features/manga';

export const Route = createFileRoute('/_pages/manga/')({
    head: () => ({
        meta: [{ title: 'Манґа / Hikka' }],
    }),
    component: MangaListPage,
});

function MangaListPage() {
    return <MangaList />;
}
