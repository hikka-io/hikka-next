import type { FC } from 'react';

import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

import type { SegmentedOption } from './segmented-control';

type Props<T extends string> = {
    options: SegmentedOption<T>[];
    value: T;
    onValueChange: (value: T) => void;
};

function SegmentedControl<T extends string>({
    options,
    value,
    onValueChange,
}: Props<T>): ReturnType<FC> {
    return (
        <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
            <Picker
                selection={value}
                onSelectionChange={onValueChange}
                modifiers={[pickerStyle('segmented')]}
            >
                {options.map((option) => (
                    <Text key={option.value} modifiers={[tag(option.value)]}>
                        {option.label}
                    </Text>
                ))}
            </Picker>
        </Host>
    );
}

export default SegmentedControl;
