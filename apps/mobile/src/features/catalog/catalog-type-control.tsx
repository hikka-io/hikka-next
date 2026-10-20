import type { FC } from 'react';

import { SegmentedControl } from '@expo/ui/community/segmented-control';
import * as Haptics from 'expo-haptics';
import { useColorScheme, View } from 'react-native';

import { CONTENT_TYPES } from '@hikka/core';

import { CATALOG_TYPES } from '@/features/filters';

import { useCatalogPrefs } from './catalog-prefs-store';

const LABELS = CATALOG_TYPES.map((type) => CONTENT_TYPES[type].title_ua);

/** The web's anime / manga / novel catalog pages as one native segmented control. */
const CatalogTypeControl: FC = () => {
    const type = useCatalogPrefs((state) => state.type);
    const setType = useCatalogPrefs((state) => state.setType);
    const scheme = useColorScheme();

    return (
        <View className="px-4 pb-3">
            <SegmentedControl
                values={LABELS}
                appearance={scheme === 'dark' ? 'dark' : 'light'}
                selectedIndex={CATALOG_TYPES.indexOf(type)}
                onChange={(event) => {
                    const next =
                        CATALOG_TYPES[event.nativeEvent.selectedSegmentIndex];

                    if (next && next !== type) {
                        Haptics.selectionAsync();
                        setType(next);
                    }
                }}
            />
        </View>
    );
};

export default CatalogTypeControl;
