import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { ScrollView } from 'react-native';

import type { FavouriteContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES } from '@hikka/core';

import { Chip } from '@/components/ui/chip';

type Props = {
    categories: readonly FavouriteContentTypeEnum[];
    count: (type: FavouriteContentTypeEnum) => number;
    value: FavouriteContentTypeEnum;
    onValueChange: (type: FavouriteContentTypeEnum) => void;
};

/** The web's favourites `ChipTabs`, bleeding to the screen edges from a `px-4` parent. */
const FavouriteChips: FC<Props> = ({
    categories,
    count,
    value,
    onValueChange,
}) => (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-4"
        contentContainerClassName="gap-2 px-4"
    >
        {categories.map((type) => (
            <Chip
                key={type}
                selected={type === value}
                onPress={() => {
                    if (type === value) return;
                    void Haptics.selectionAsync();
                    onValueChange(type);
                }}
            >
                {`${CONTENT_TYPES[type].plural} ${count(type)}`}
            </Chip>
        ))}
    </ScrollView>
);

export default FavouriteChips;
