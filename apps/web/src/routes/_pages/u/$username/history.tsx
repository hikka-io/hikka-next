import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { historySearchSchema } from '@hikka/core';

import { UserHistoryPage } from '@/features/users';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/u/$username/history')({
    validateSearch: zodValidator(historySearchSchema),
    head: ({ params }) =>
        generateHeadMeta({ title: `Історія / ${params.username}` }),
    component: HistoryPage,
});

function HistoryPage() {
    return (
        <div className="flex flex-col gap-12">
            <UserHistoryPage />
        </div>
    );
}
