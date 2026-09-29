import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { UserHistoryPage } from '@/features/users';
import { generateHeadMeta } from '@/utils/metadata';
import { historySearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/u/$username/history')({
    validateSearch: zodValidator(historySearchSchema),
    head: ({ params }) =>
        generateHeadMeta({ title: `Активність / ${params.username}` }),
    component: HistoryPage,
});

function HistoryPage() {
    return (
        <div className="flex flex-col gap-12">
            <UserHistoryPage />
        </div>
    );
}
