import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';
import { Platform } from 'react-native';

import type { SortOrder } from '@hikka/core';

/** Compose toolbar items take image sources only; SF Symbols are iOS-only. */
const SORT_ICON =
    Platform.OS === 'android'
        ? require('../../assets/icons/swap-vert.xml')
        : 'arrow.up.arrow.down';

const ORDERS: { value: SortOrder; label: string }[] = [
    { value: 'desc', label: 'За спаданням' },
    { value: 'asc', label: 'За зростанням' },
];

type Option<T extends string> = { value: T; label: string; icon?: SFSymbol };

type Args<V extends string> = {
    views: readonly Option<V>[];
    view: V;
    onViewChange: (view: V) => void;
    sortOptions: readonly Option<string>[];
    sort: string;
    onSortChange: (sort: string) => void;
    order: SortOrder;
    onOrderChange: (order: SortOrder) => void;
};

const select = (apply: () => void) => {
    Haptics.selectionAsync();
    apply();
};

/**
 * The web's view toggle, sort select and order button as one native header menu with three
 * inline sections. A function, not a component: `Stack.Toolbar` only accepts its own item
 * types as direct children.
 */
export function renderViewSortMenu<V extends string>({
    views,
    view,
    onViewChange,
    sortOptions,
    sort,
    onSortChange,
    order,
    onOrderChange,
}: Args<V>) {
    return (
        <Stack.Toolbar.Menu
            icon={SORT_ICON}
            accessibilityLabel="Вигляд і сортування"
        >
            <Stack.Toolbar.Menu inline title="Вигляд">
                {views.map((option) => (
                    <Stack.Toolbar.MenuAction
                        key={option.value}
                        icon={option.icon}
                        isOn={view === option.value}
                        onPress={() => select(() => onViewChange(option.value))}
                    >
                        {option.label}
                    </Stack.Toolbar.MenuAction>
                ))}
            </Stack.Toolbar.Menu>
            <Stack.Toolbar.Menu inline title="Сортування">
                {sortOptions.map((option) => (
                    <Stack.Toolbar.MenuAction
                        key={option.value}
                        isOn={sort === option.value}
                        onPress={() => select(() => onSortChange(option.value))}
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
                            select(() => onOrderChange(option.value))
                        }
                    >
                        {option.label}
                    </Stack.Toolbar.MenuAction>
                ))}
            </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
    );
}
