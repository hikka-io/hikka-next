import type { FC } from 'react';

import { Stack, useRouter } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';
import { Platform } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { getSort } from '@hikka/core';

import { renderViewSortMenu } from '@/components/view-sort-menu';
import {
    setParam,
    useCatalogSearch,
    useHasActiveFilters,
    useUpdateCatalogSearch,
} from '@/features/filters';

import { type CatalogView, useCatalogPrefs } from './catalog-prefs-store';

const VIEWS: { value: CatalogView; label: string; icon: SFSymbol }[] = [
    { value: 'grid', label: 'Сітка', icon: 'square.grid.2x2' },
    { value: 'list', label: 'Список', icon: 'list.bullet' },
];

/** Compose toolbar items take image sources only; SF Symbols are iOS-only. */
const ANDROID = Platform.OS === 'android';
const FILTER_ICON = require('../../../assets/icons/filter-list.xml');

/** Filters open the sheet; view and sort live in one native menu (web: view toggle + sort select). */
const CatalogToolbar: FC = () => {
    const router = useRouter();
    const type = useCatalogPrefs((state) => state.type);
    const view = useCatalogPrefs((state) => state.view);
    const setView = useCatalogPrefs((state) => state.setView);
    const badge = useCSSVariable('--color-primary-foreground');
    const search = useCatalogSearch(type);
    const update = useUpdateCatalogSearch(type);

    const options = getSort(type);
    const sort = search.sort ?? options[0]?.value;
    const order = search.order ?? 'desc';
    const filtered = useHasActiveFilters(type);

    return (
        <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
                icon={
                    ANDROID
                        ? FILTER_ICON
                        : filtered
                          ? 'line.3.horizontal.decrease.circle.fill'
                          : 'line.3.horizontal.decrease.circle'
                }
                accessibilityLabel="Фільтри"
                onPress={() =>
                    router.push({
                        pathname: '/catalog-filters',
                        params: { type },
                    })
                }
            >
                {/* Android icons are static images; a dot marks active filters instead of a filled icon. */}
                {ANDROID && filtered ? (
                    <Stack.Toolbar.Badge
                        style={{
                            backgroundColor:
                                typeof badge === 'string' ? badge : undefined,
                        }}
                    />
                ) : null}
            </Stack.Toolbar.Button>
            {renderViewSortMenu({
                views: VIEWS,
                view,
                onViewChange: setView,
                sortOptions: options,
                sort,
                onSortChange: (value) =>
                    update((prev) => setParam(prev, 'sort', value)),
                order,
                onOrderChange: (value) =>
                    update((prev) => setParam(prev, 'order', value)),
            })}
        </Stack.Toolbar>
    );
};

export default CatalogToolbar;
