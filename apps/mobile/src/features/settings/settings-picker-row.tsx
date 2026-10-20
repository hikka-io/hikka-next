import { ListItem, Picker } from '@expo/ui';
import * as Haptics from 'expo-haptics';

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
        <ListItem
            trailing={
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
            }
        >
            {title}
        </ListItem>
    );
}

export default SettingsPickerRow;
