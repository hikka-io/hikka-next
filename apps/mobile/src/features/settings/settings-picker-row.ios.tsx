import { Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import * as Haptics from 'expo-haptics';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
    title: string;
    value: T;
    options: readonly Option<T>[];
    onValueChange: (value: T) => void;
    disabled?: boolean;
};

// A Form picker row: the title leading, the current option trailing, a menu on tap.
function SettingsPickerRow<T extends string>({
    title,
    value,
    options,
    onValueChange,
}: Props<T>) {
    return (
        <Picker
            label={title}
            selection={value}
            onSelectionChange={(next: T) => {
                Haptics.selectionAsync();
                onValueChange(next);
            }}
            modifiers={[pickerStyle('menu')]}
        >
            {options.map((option) => (
                <Text key={option.value} modifiers={[tag(option.value)]}>
                    {option.label}
                </Text>
            ))}
        </Picker>
    );
}

export default SettingsPickerRow;
