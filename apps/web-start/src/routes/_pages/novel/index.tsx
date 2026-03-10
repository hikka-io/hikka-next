import { createFileRoute } from '@tanstack/react-router';

import { NovelList } from '@/features/novel';

export const Route = createFileRoute('/_pages/novel/')({
    head: () => ({
        meta: [{ title: 'Ранобе / Hikka' }],
    }),
    component: NovelListPage,
});

function NovelListPage() {
    return <NovelList />;
}
