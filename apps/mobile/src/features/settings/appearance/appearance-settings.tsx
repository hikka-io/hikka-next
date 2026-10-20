import type { FC } from 'react';

import { FieldGroup } from '@expo/ui';
import * as Haptics from 'expo-haptics';

import {
    ACCENT_PRESETS,
    DEFAULT_BRAND,
    oklchEqual,
    oklchToHex,
} from '@hikka/core';

import { useAuthToken } from '@/features/auth';
import { useSessionUI, useUpdateSessionUI } from '@/services/session';

import SettingsFooterText from '../settings-footer-text';
import SettingsForm from '../settings-form';
import SettingsPickerRow from '../settings-picker-row';
import AccentRow from './accent-row';
import { type ThemePreference, useThemeStore } from './theme-store';

const THEME_OPTIONS = [
    { value: 'system', label: 'Системна' },
    { value: 'light', label: 'Світла' },
    { value: 'dark', label: 'Темна' },
] as const satisfies readonly { value: ThemePreference; label: string }[];

const AppearanceSettings: FC = () => {
    const signedIn = !!useAuthToken();
    const theme = useThemeStore((state) => state.theme);
    const setTheme = useThemeStore((state) => state.setTheme);
    const { styles, isPending, error } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const brand = styles.brand ?? DEFAULT_BRAND;
    // A write replaces the whole document, so colors are offered only once the saved one was read.
    const colorsReady = signedIn && !isPending && !error;

    return (
        <SettingsForm>
            <FieldGroup.Section title="Тема">
                <SettingsPickerRow
                    title="Тема застосунку"
                    value={theme}
                    options={THEME_OPTIONS}
                    onValueChange={setTheme}
                />
                <FieldGroup.SectionFooter>
                    <SettingsFooterText>
                        Системна тема слідує налаштуванням пристрою. Вибір
                        зберігається лише на цьому пристрої.
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            {colorsReady ? (
                <FieldGroup.Section title="Основний колір">
                    {ACCENT_PRESETS.map((preset) => (
                        <AccentRow
                            key={preset.name}
                            name={preset.name}
                            color={oklchToHex(preset.brand)}
                            selected={oklchEqual(preset.brand, brand)}
                            onPress={() => {
                                if (oklchEqual(preset.brand, brand)) return;
                                Haptics.selectionAsync();
                                update({
                                    styles: { ...styles, brand: preset.brand },
                                });
                            }}
                        />
                    ))}
                    <FieldGroup.SectionFooter>
                        <SettingsFooterText>
                            Колір акценту зберігається в акаунті й діє також на
                            сайті.
                        </SettingsFooterText>
                    </FieldGroup.SectionFooter>
                </FieldGroup.Section>
            ) : null}
        </SettingsForm>
    );
};

export default AppearanceSettings;
