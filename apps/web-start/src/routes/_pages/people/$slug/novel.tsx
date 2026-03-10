import { createFileRoute } from '@tanstack/react-router';

import { PersonNovel as Novel } from '@/features/people';

export const Route = createFileRoute('/_pages/people/$slug/novel')({
    head: () => ({
        meta: [{ title: 'Ранобе' }],
    }),
    component: PersonNovelPage,
});

function PersonNovelPage() {
    return (
        <div className="flex flex-col gap-12">
            <Novel extended />
        </div>
    );
}
