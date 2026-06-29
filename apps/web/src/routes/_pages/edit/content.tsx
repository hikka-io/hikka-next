import { createFileRoute } from '@tanstack/react-router';

import { EditContentList as ContentList } from '@/features/edit';

export const Route = createFileRoute('/_pages/edit/content')({
    head: () => ({
        meta: [{ title: 'Контент / Правки / Hikka' }],
    }),
    component: ContentPage,
});

function ContentPage() {
    return <ContentList />;
}
