import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';

import { getSort, type SortOrder } from '@hikka/core';

import { useSession } from '@/features/auth';
import {
    getActiveFilters,
    setParam,
    useCatalogSearch,
    useUpdateCatalogSearch,
} from '@/features/filters';

import { type CatalogView, useCatalogPrefs } from './catalog-prefs-store';

const VIEWS: {
    value: CatalogView;
    label: string;
    icon: 'square.grid.2x2' | 'list.bullet';
}[] = [
    { value: 'grid', label: 'Сітка', icon: 'square.grid.2x2' },
    { value: 'list', label: 'Список', icon: 'list.bullet' },
];

const ORDERS: { value: SortOrder; label: string }[] = [
    { value: 'desc', label: 'За спаданням' },
    { value: 'asc', label: 'За зростанням' },
];

/** Filters open the sheet; view and sort live in one native menu (web: view toggle + sort select). */
const CatalogToolbar: FC = () => {
    const router = useRouter();
    const { type, view, setView } = useCatalogPrefs();
    const search = useCatalogSearch(type);
    const update = useUpdateCatalogSearch(type);
    const { hasToken } = useSession();

    const options = getSort(type);
    const sort = search.sort ?? options[0]?.value;
    const order = search.order ?? 'desc';
    const filtered =
        getActiveFilters(search, { signedIn: hasToken }).length > 0;

    const select = (apply: () => void) => {
        Haptics.selectionAsync();
        apply();
    };

    return (
        <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
                icon={
                    filtered
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
            />
            <Stack.Toolbar.Menu
                icon="arrow.up.arrow.down"
                accessibilityLabel="Вигляд і сортування"
            >
                <Stack.Toolbar.Menu inline title="Вигляд">
                    {VIEWS.map((option) => (
                        <Stack.Toolbar.MenuAction
                            key={option.value}
                            icon={option.icon}
                            isOn={view === option.value}
                            onPress={() => select(() => setView(option.value))}
                        >
                            {option.label}
                        </Stack.Toolbar.MenuAction>
                    ))}
                </Stack.Toolbar.Menu>
                <Stack.Toolbar.Menu inline title="Сортування">
                    {options.map((option) => (
                        <Stack.Toolbar.MenuAction
                            key={option.value}
                            isOn={sort === option.value}
                            onPress={() =>
                                select(() =>
                                    update((prev) =>
                                        setParam(prev, 'sort', option.value),
                                    ),
                                )
                            }
                        >
                            {option.label}
                        </Stack.Toolbar.MenuAction>
                    ))}
                </Stack.Toolbar.Menu>
                <Stack.Toolbar.Menu inline title="Порядок">
                    {ORDERS.map((option) => (
                        <Stack.Toolbar.MenuAction
                            key={option.value}
                            isOn={order === option.value}
                            onPress={() =>
                                select(() =>
                                    update((prev) =>
                                        setParam(prev, 'order', option.value),
                                    ),
                                )
                            }
                        >
                            {option.label}
                        </Stack.Toolbar.MenuAction>
                    ))}
                </Stack.Toolbar.Menu>
            </Stack.Toolbar.Menu>
        </Stack.Toolbar>
    );
};

export default CatalogToolbar;
