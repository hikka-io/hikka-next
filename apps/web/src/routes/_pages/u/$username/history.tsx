import { createFileRoute } from '@tanstack/react-router';

import { UserHistory as History } from '@/features/users';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/u/$username/history')({
    head: ({ params }) =>
        generateHeadMeta({ title: `Активність / ${params.username}` }),
    component: HistoryPage,
});

function HistoryPage() {
    return (
        <div className="flex flex-col gap-12">
            <History />
        </div>
    );
}
