import { createFileRoute } from '@tanstack/react-router';

import {
    ReadListImport,
    SettingsPage,
    SettingsSection,
    settingsHead,
    WatchListImport,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/list/import')({
    head: () => settingsHead('Імпорт списку'),
    component: ListImportPage,
});

function ListImportPage() {
    return (
        <SettingsPage
            title="Імпорт"
            description="Імпортуйте аніме, манґу та ранобе з інших сервісів"
        >
            <SettingsSection title="Імпорт аніме">
                <WatchListImport />
            </SettingsSection>
            <SettingsSection title="Імпорт манґи та ранобе">
                <ReadListImport />
            </SettingsSection>
        </SettingsPage>
    );
}
