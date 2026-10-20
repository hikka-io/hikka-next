import type { FC } from 'react';

import { Stack, useRouter } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';
import { Platform } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { ContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES, getSort, type SortOrder } from '@hikka/core';

import { renderViewSortMenu } from '@/components/view-sort-menu';

import type { ListContentType } from '../queries';
import { useRandomListEntry } from './use-random-list-entry';
import type { UserListView } from './user-list-prefs-store';

const VIEWS: { value: UserListView; label: string; icon: SFSymbol }[] = [
    { value: 'list', label: 'Список', icon: 'list.bullet' },
    { value: 'grid', label: 'Сітка', icon: 'square.grid.2x2' },
];

/** Compose toolbar items take image sources only; SF Symbols are iOS-only. */
const ANDROID = Platform.OS === 'android';
const FILTER_ICON = require('../../../../assets/icons/filter-list.xml');
const RANDOM_ICON = require('../../../../assets/icons/shuffle.xml');

type Props = {
    username: string;
    contentType: ListContentType;
    status: string;
    filtered: boolean;
    filtersKey: string;
    onOpenFilters: () => void;
    view: UserListView;
    onViewChange: (view: UserListView) => void;
    sort: string;
    onSortChange: (sort: string) => void;
    order: SortOrder;
    onOrderChange: (order: SortOrder) => void;
};

const randomLabel = (contentType: ListContentType) =>
    `${contentType === ContentTypeEnum.MANGA ? 'Випадкова' : 'Випадкове'} ${CONTENT_TYPES[contentType].title_ua.toLowerCase()}`;

/** The web's list navbar: the filter sheet, the random title and one view, sort and order menu. */
const UserListToolbar: FC<Props> = ({
    username,
    contentType,
    status,
    filtered,
    filtersKey,
    onOpenFilters,
    view,
    onViewChange,
    sort,
    onSortChange,
    order,
    onOrderChange,
}) => {
    const router = useRouter();
    const badge = useCSSVariable('--color-primary-foreground');
    const { mutate: pickRandom, isPending } = useRandomListEntry(
        username,
        contentType,
        status,
    );

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
                onPress={() => {
                    onOpenFilters();
                    router.push({
                        pathname: '/catalog-filters',
                        params: { type: contentType, filters: filtersKey },
                    });
                }}
            >
                {ANDROID && filtered ? (
                    <Stack.Toolbar.Badge
                        style={{
                            backgroundColor:
                                typeof badge === 'string' ? badge : undefined,
                        }}
                    />
                ) : null}
            </Stack.Toolbar.Button>
            <Stack.Toolbar.Button
                icon={ANDROID ? RANDOM_ICON : 'shuffle'}
                accessibilityLabel={randomLabel(contentType)}
                disabled={isPending}
                onPress={() => pickRandom()}
            />
            {renderViewSortMenu({
                views: VIEWS,
                view,
                onViewChange,
                sortOptions: getSort(
                    contentType === ContentTypeEnum.ANIME ? 'watch' : 'read',
                ),
                sort,
                onSortChange,
                order,
                onOrderChange,
            })}
        </Stack.Toolbar>
    );
};

export default UserListToolbar;
