import { createFileRoute } from '@tanstack/react-router';

import { UserHistory as History } from '@/features/users';

export const Route = createFileRoute('/_pages/u/$username/history')({
    head: () => ({
        meta: [{ title: 'Активність / Hikka' }],
    }),
    component: HistoryPage,
});

function HistoryPage() {
    return (
        <div className="flex flex-col gap-12">
            <History />
        </div>
    );
}
