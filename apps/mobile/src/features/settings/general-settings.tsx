import type { FC } from 'react';

import { FieldGroup } from '@expo/ui';

import {
    NAME_LANGUAGE_OPTIONS,
    type NameLanguage,
    TITLE_LANGUAGE_OPTIONS,
    type TitleLanguage,
} from '@hikka/core';

import { useSessionUI, useUpdateSessionUI } from '@/services/session';

import SettingsFooterText from './settings-footer-text';
import SettingsForm from './settings-form';
import SettingsLoading from './settings-loading';
import SettingsPickerRow from './settings-picker-row';
import SettingsSwitchRow from './settings-switch-row';

const GeneralSettings: FC = () => {
    const ui = useSessionUI();
    const { update } = useUpdateSessionUI();

    if (ui.isPending || ui.error) {
        return (
            <SettingsLoading
                isPending={ui.isPending}
                error={ui.error}
                onRetry={ui.refetch}
            />
        );
    }

    return (
        <SettingsForm>
            <FieldGroup.Section title="Мова">
                <SettingsPickerRow
                    title="Назви контенту"
                    value={ui.titleLanguage}
                    options={TITLE_LANGUAGE_OPTIONS}
                    onValueChange={(title_language: TitleLanguage) =>
                        update({ preferences: { title_language } })
                    }
                />
                <SettingsPickerRow
                    title="Імена"
                    value={ui.nameLanguage}
                    options={NAME_LANGUAGE_OPTIONS}
                    onValueChange={(name_language: NameLanguage) =>
                        update({ preferences: { name_language } })
                    }
                />
                <FieldGroup.SectionFooter>
                    <SettingsFooterText>
                        Мова назв аніме, манґи й ранобе та імен персонажів і
                        людей. Якщо перекладу немає, показується наявний.
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title="Контент">
                <SettingsSwitchRow
                    title="Контент 18+"
                    value={ui.showNsfw}
                    onValueChange={(show_nsfw) =>
                        update({ preferences: { show_nsfw } })
                    }
                />
                <FieldGroup.SectionFooter>
                    <SettingsFooterText>
                        Показувати відвертий контент без попередження
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
        </SettingsForm>
    );
};

export default GeneralSettings;
