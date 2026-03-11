import { createFileRoute } from '@tanstack/react-router';

import { PersonNovel as Novel } from '@/features/people';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/novel')({
    head: () => generateHeadMeta({ title: 'Ранобе', robots: { index: false } }),
    component: PersonNovelPage,
});

function PersonNovelPage() {
    return (
        <div className="flex flex-col gap-12">
            <Novel extended />
        </div>
    );
}
