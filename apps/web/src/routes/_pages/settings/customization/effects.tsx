import { createFileRoute } from '@tanstack/react-router';

import {
    EffectsSettings,
    SettingsPage,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/customization/effects')({
    head: () => settingsHead('Ефекти', 'Кастомізація'),
    component: CustomizationEffectsPage,
});

function CustomizationEffectsPage() {
    return (
        <SettingsPage
            title="Ефекти"
            description="Керуйте візуальними ефектами інтерфейсу"
        >
            <EffectsSettings />
        </SettingsPage>
    );
}
