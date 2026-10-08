import { createFileRoute } from '@tanstack/react-router';

import {
    ListExport,
    ListRemoval,
    SettingsPage,
    SettingsSection,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/list/export')({
    head: () => settingsHead('Експорт списку'),
    component: ListExportPage,
});

function ListExportPage() {
    return (
        <SettingsPage
            title="Експорт"
            description="Завантажте резервну копію або видаліть свої списки"
        >
            <SettingsSection title="Експорт списків">
                <ListExport />
            </SettingsSection>
            <SettingsSection title="Видалення списку">
                <ListRemoval />
            </SettingsSection>
        </SettingsPage>
    );
}
