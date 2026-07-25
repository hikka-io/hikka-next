import { createFileRoute } from '@tanstack/react-router';

import { usePageHeader } from '@/features/app-shell';
import { EditContentList as ContentList } from '@/features/edit';

export const Route = createFileRoute('/_pages/edit/content')({
    head: () => ({
        meta: [{ title: 'Контент / Правки / Hikka' }],
    }),
    component: ContentPage,
});

function ContentPage() {
    usePageHeader({ title: 'Незаповнений контент', parent: '/edit' });

    return <ContentList />;
}
