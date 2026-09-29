import { createFileRoute } from '@tanstack/react-router';

import {
    GeneralSettings,
    SettingsPage,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/customization/general')({
    head: () => settingsHead('Загальне', 'Кастомізація'),
    component: CustomizationGeneralPage,
});

function CustomizationGeneralPage() {
    return (
        <SettingsPage
            title="Загальне"
            description="Налаштуйте відображення контенту та інше"
        >
            <GeneralSettings />
        </SettingsPage>
    );
}
