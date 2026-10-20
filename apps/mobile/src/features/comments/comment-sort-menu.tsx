import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { COMMENT_SORT_OPTIONS, type CommentOrder } from '@hikka/core';

/** Compose toolbar items take image sources only; SF Symbols are iOS-only. */
const SORT_ICON =
    Platform.OS === 'android'
        ? require('../../../assets/icons/swap-vert.xml')
        : 'arrow.up.arrow.down';

const ORDERS: { value: CommentOrder; label: string }[] = [
    { value: 'desc', label: 'За спаданням' },
    { value: 'asc', label: 'За зростанням' },
];

type Props = {
    sort: string;
    order: CommentOrder;
    onSortChange: (sort: string) => void;
    onOrderChange: (order: CommentOrder) => void;
    /** A user's comments can drop replies (the web's "Без відповідей"). */
    firstLevelOnly?: boolean;
    onFirstLevelOnlyChange?: (value: boolean) => void;
};

/** The web's comment `Sort` select and order button as one header menu, like the catalog. */
const CommentSortMenu: FC<Props> = ({
    sort,
    order,
    onSortChange,
    onOrderChange,
    firstLevelOnly,
    onFirstLevelOnlyChange,
}) => {
    const select = (apply: () => void) => {
        void Haptics.selectionAsync();
        apply();
    };

    return (
        <Stack.Toolbar placement="right">
            <Stack.Toolbar.Menu
                icon={SORT_ICON}
                accessibilityLabel="Сортування"
            >
                <Stack.Toolbar.Menu inline title="Сортування">
                    {COMMENT_SORT_OPTIONS.map((option) => (
                        <Stack.Toolbar.MenuAction
                            key={option.value}
                            isOn={sort === option.value}
                            onPress={() =>
                                select(() => onSortChange(option.value))
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
                                select(() => onOrderChange(option.value))
                            }
                        >
                            {option.label}
                        </Stack.Toolbar.MenuAction>
                    ))}
                </Stack.Toolbar.Menu>
                {onFirstLevelOnlyChange && (
                    <Stack.Toolbar.Menu inline title="Фільтр">
                        <Stack.Toolbar.MenuAction
                            isOn={!!firstLevelOnly}
                            onPress={() =>
                                select(() =>
                                    onFirstLevelOnlyChange(!firstLevelOnly),
                                )
                            }
                        >
                            Без відповідей
                        </Stack.Toolbar.MenuAction>
                    </Stack.Toolbar.Menu>
                )}
            </Stack.Toolbar.Menu>
        </Stack.Toolbar>
    );
};

export default CommentSortMenu;
