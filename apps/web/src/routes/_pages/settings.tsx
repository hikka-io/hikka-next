import { createFileRoute, Outlet } from '@tanstack/react-router';

import { usePageHeader } from '@/features/app-shell';
import { getActiveTopLevelHref, SettingsSidebar } from '@/features/settings';
import { requireAuth } from '@/utils/auth';
import { SETTINGS_MENU } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';
import { usePathname } from '@/utils/navigation';

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
    const pathname = usePathname();
    const activeHref = getActiveTopLevelHref(SETTINGS_MENU, pathname);

    usePageHeader({
        title: 'Налаштування',
        subtitle: SETTINGS_MENU.find((item) => item.href === activeHref)?.title,
        parent: '/',
    });

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-start md:gap-x-10">
            <SettingsSidebar className="md:sticky md:top-20 md:w-64 md:shrink-0" />
            <div className="min-w-0 flex-1">
                <Outlet />
            </div>
        </div>
    );
}
