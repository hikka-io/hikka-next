import { createFileRoute, Outlet } from '@tanstack/react-router';

import { SettingsSidebar } from '@/features/settings';
import { requireAuth } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/settings')({
    beforeLoad: async ({ context: { queryClient } }) => {
        requireAuth(queryClient);
    },
    head: () =>
        generateHeadMeta({
            title: 'Налаштування',
            robots: { index: false },
        }),
    component: SettingsLayout,
});

function SettingsLayout() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <SettingsSidebar className="md:sticky md:top-20 md:w-60 md:shrink-0" />
            <div className="min-w-0 flex-1">
                <Outlet />
            </div>
        </div>
    );
}
