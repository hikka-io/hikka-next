import { Picker } from '@expo/ui';
import { Box } from '@expo/ui/jetpack-compose';
import { width } from '@expo/ui/jetpack-compose/modifiers';
import * as Haptics from 'expo-haptics';

import SettingsListItem from './settings-list-item';

const PICKER_WIDTH_DP = 168;

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
    title: string;
    value: T;
    options: readonly Option<T>[];
    onValueChange: (value: T) => void;
    disabled?: boolean;
};

function SettingsPickerRow<T extends string>({
    title,
    value,
    options,
    onValueChange,
    disabled,
}: Props<T>) {
    return (
        <SettingsListItem
            trailing={
                <Box modifiers={[width(PICKER_WIDTH_DP)]}>
                    <Picker
                        selectedValue={value}
                        enabled={!disabled}
                        onValueChange={(next) => {
                            Haptics.selectionAsync();
                            onValueChange(next as T);
                        }}
                    >
                        {options.map((option) => (
                            <Picker.Item
                                key={option.value}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                </Box>
            }
        >
            {title}
        </SettingsListItem>
    );
}

export default SettingsPickerRow;
