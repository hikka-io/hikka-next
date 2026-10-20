import type { FC } from 'react';

import { View } from 'react-native';

import { CONTENT_TYPES } from '@hikka/core';

import SegmentedControl from '@/components/ui/segmented-control';
import { CATALOG_TYPES } from '@/features/filters';

import { useCatalogPrefs } from './catalog-prefs-store';

const OPTIONS = CATALOG_TYPES.map((type) => ({
    label: CONTENT_TYPES[type].title_ua,
    value: type,
}));

/** The web's anime / manga / novel catalog pages as one native segmented control. */
const CatalogTypeControl: FC = () => {
    const type = useCatalogPrefs((state) => state.type);
    const setType = useCatalogPrefs((state) => state.setType);

    return (
        <View className="px-4 pb-3">
            <SegmentedControl
                options={OPTIONS}
                value={type}
                onValueChange={setType}
            />
        </View>
    );
};

export default CatalogTypeControl;
