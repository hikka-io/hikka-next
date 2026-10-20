import { View } from 'react-native';

import ToggleChip from './toggle-chip';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
};

function ChipTabs<T extends string>({ options, value, onChange }: Props<T>) {
    return (
        <View className="flex-row gap-2" accessibilityRole="tablist">
            {options.map((option) => (
                <ToggleChip
                    key={option.value}
                    accessibilityRole="tab"
                    selected={option.value === value}
                    onPress={() => onChange(option.value)}
                >
                    {option.label}
                </ToggleChip>
            ))}
        </View>
    );
}

export default ChipTabs;
