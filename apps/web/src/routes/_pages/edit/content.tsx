import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { usePageHeader } from '@/features/app-shell';
import { EditContentList as ContentList } from '@/features/edit';
import { editContentSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/content')({
    validateSearch: zodValidator(editContentSearchSchema),
    head: () => ({
        meta: [{ title: 'Контент / Правки / Hikka' }],
    }),
    component: ContentPage,
});

function ContentPage() {
    usePageHeader({ title: 'Незаповнений контент', parent: '/edit' });

    return <ContentList />;
}
