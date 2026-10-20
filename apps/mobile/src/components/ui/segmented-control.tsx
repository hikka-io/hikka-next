import type { FC } from 'react';

import { View } from 'react-native';

import { Chip } from './chip';

export type SegmentedOption<T extends string> = { label: string; value: T };

type Props<T extends string> = {
    options: SegmentedOption<T>[];
    value: T;
    onValueChange: (value: T) => void;
};

// Android: Material's segmented button is not wired in yet, so the options render as a chip row.
function SegmentedControl<T extends string>({
    options,
    value,
    onValueChange,
}: Props<T>): ReturnType<FC> {
    return (
        <View className="flex-row gap-2">
            {options.map((option) => (
                <Chip
                    key={option.value}
                    selected={option.value === value}
                    onPress={() => onValueChange(option.value)}
                >
                    {option.label}
                </Chip>
            ))}
        </View>
    );
}

export default SegmentedControl;
