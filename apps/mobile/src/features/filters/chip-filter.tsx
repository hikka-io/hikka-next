import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import type { FilterProperty } from '@hikka/core';

import { Chip } from '@/components/ui/chip';

import FilterSection from './filter-section';

type Props = {
    title: string;
    options: FilterProperty<string>;
    selected?: string[];
    onToggle: (value: string) => void;
};

/** A multi-select row of chips, like the web's badge filters (status, type, season, rating). */
const ChipFilter: FC<Props> = ({ title, options, selected, onToggle }) => {
    return (
        <FilterSection title={title}>
            <View className="flex-row flex-wrap gap-x-2">
                {Object.entries(options).map(([value, option]) => {
                    const active = selected?.includes(value) ?? false;

                    return (
                        <Chip
                            key={value}
                            selected={active}
                            className={active ? undefined : 'bg-secondary'}
                            accessibilityHint={option.description}
                            onPress={() => {
                                Haptics.selectionAsync();
                                onToggle(value);
                            }}
                        >
                            {option.title_ua}
                        </Chip>
                    );
                })}
            </View>
        </FilterSection>
    );
};

export default ChipFilter;
