import { createFileRoute } from '@tanstack/react-router';

import {
    AppearanceResetButton,
    AppearanceSettings,
    SettingsPage,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute(
    '/_pages/settings/customization/appearance',
)({
    head: () => settingsHead('Вигляд', 'Кастомізація'),
    component: CustomizationAppearancePage,
});

function CustomizationAppearancePage() {
    return (
        <SettingsPage
            title="Вигляд"
            description="Налаштуйте теми, кольори та відображення"
            trailingAction={<AppearanceResetButton />}
        >
            <AppearanceSettings />
        </SettingsPage>
    );
}
