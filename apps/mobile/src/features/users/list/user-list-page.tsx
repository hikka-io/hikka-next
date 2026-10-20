import { type FC, useEffect, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { Stack, useIsFocused, useRoute, useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import {
    CONTENT_TYPES,
    DEFAULT_USER_LIST_STATUS,
    type SortOrder,
    USER_LIST_ALL_STATUS,
} from '@hikka/core';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';
import { useSession } from '@/features/auth';
import { clearFilters, hasActiveFilters } from '@/features/filters';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { byUsername, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import { statusLabel, statusOrder } from '../list-status';
import {
    DEFAULT_PAGE_SIZE,
    type ListContentType,
    type UserListEntry,
    userListOptions,
} from '../queries';
import ListEntryPoster from './list-entry-poster';
import ListEntryRow from './list-entry-row';
import ListEntryRowSkeleton from './list-entry-row-skeleton';
import ListStatusChips from './list-status-chips';
import {
    useResetUserListFilters,
    userListFiltersKey,
    useUpdateUserListFilters,
    useUserListFilters,
} from './user-list-filters-store';
import { useUserListPrefs } from './user-list-prefs-store';
import UserListToolbar from './user-list-toolbar';

const TYPES = [
    { label: 'Аніме', value: ContentTypeEnum.ANIME },
    { label: 'Манґа', value: ContentTypeEnum.MANGA },
    { label: 'Ранобе', value: ContentTypeEnum.NOVEL },
];

const GRID_COLUMNS = 3;
/** With the cells' `px-1.5`, the grid keeps the screen's 16 pt gutter. */
const GRID_CONTAINER = { paddingHorizontal: 10, paddingBottom: 16 };
const LIST_CONTAINER = { paddingBottom: 16 };
const SKELETON_ITEMS: null[] = Array.from(
    { length: DEFAULT_PAGE_SIZE },
    () => null,
);

// "Дивлюсь" and "Читаю" are one list position, so switching the type keeps it.
const IN_PROGRESS: Partial<Record<string, string>> = {
    watching: 'reading',
    reading: 'watching',
};

/** A status the type has, or `all`; anything else opens the web's default. */
export function resolveListStatus(
    contentType: ListContentType,
    status?: string,
): string {
    if (!status) return DEFAULT_USER_LIST_STATUS;
    if (status === USER_LIST_ALL_STATUS) return status;

    const order: readonly string[] = statusOrder(contentType);
    if (order.includes(status)) return status;

    const swapped = IN_PROGRESS[status];
    return swapped && order.includes(swapped)
        ? swapped
        : DEFAULT_USER_LIST_STATUS;
}

const defaultSort = (contentType: ListContentType) =>
    contentType === ContentTypeEnum.ANIME ? 'watch_score' : 'read_score';

type Props = {
    username: string;
    contentType: ListContentType;
    initialStatus?: string;
};

/** The web's `/u/<name>/list/<type>`: type switch, status chips, view and sort menu, infinite list. */
const UserListPage: FC<Props> = ({ username, contentType, initialStatus }) => {
    const router = useRouter();
    const { user: viewer } = useSession();
    const owner = viewer?.username?.toLowerCase() === username.toLowerCase();
    const view = useUserListPrefs((state) => state.view);
    const setView = useUserListPrefs((state) => state.setView);
    const [status, setStatus] = useState(() =>
        resolveListStatus(contentType, initialStatus),
    );
    const [sort, setSort] = useState(() => defaultSort(contentType));
    const [order, setOrder] = useState<SortOrder>('desc');
    const grid = view === 'grid';
    const { key: routeKey } = useRoute();
    const filtersKey = userListFiltersKey(routeKey, contentType);
    const filters = useUserListFilters(filtersKey);
    const updateFilters = useUpdateUserListFilters(filtersKey);
    const resetFilters = useResetUserListFilters();
    const filtered = hasActiveFilters(filters, false);

    // Filters apply live behind their sheet, which unfocuses this screen, so it stays subscribed while the sheet is open.
    const focused = useIsFocused();
    const [sheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        if (focused) setSheetOpen(false);
    }, [focused]);

    // The web drops filters with the page URL; leaving the list does the same here.
    useEffect(() => () => resetFilters(filtersKey), [filtersKey, resetFilters]);

    const { items, error, isFetchingNextPage, onEndReached, onRetry } =
        useInfiniteList<UserListEntry>({
            ...userListOptions(username, contentType, {
                ...filters,
                status,
                sort,
                order,
            }),
            subscribed: focused || sheetOpen,
        });
    const { refreshing, onRefresh } = usePullToRefresh(byUsername([username]));
    const data: (UserListEntry | null)[] =
        items ?? (error ? [] : SKELETON_ITEMS);
    const label =
        status === USER_LIST_ALL_STATUS
            ? undefined
            : statusLabel(contentType, status);

    return (
        <>
            <Stack.Title>{`Список ${CONTENT_TYPES[contentType].genitive}`}</Stack.Title>
            <UserListToolbar
                username={username}
                contentType={contentType}
                status={status}
                filtered={filtered}
                filtersKey={filtersKey}
                onOpenFilters={() => setSheetOpen(true)}
                view={view}
                onViewChange={setView}
                sort={sort}
                onSortChange={setSort}
                order={order}
                onOrderChange={setOrder}
            />
            <FlashList
                key={view}
                className="bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={grid ? GRID_CONTAINER : LIST_CONTAINER}
                data={data}
                numColumns={grid ? GRID_COLUMNS : 1}
                keyExtractor={(item, index) =>
                    item ? item.reference : `skeleton-${index}`
                }
                renderItem={({ item }) => {
                    if (grid) {
                        return (
                            <View className="px-1.5 pb-4">
                                {item ? (
                                    <ListEntryPoster
                                        entry={item}
                                        contentType={contentType}
                                        owner={owner}
                                    />
                                ) : (
                                    <PosterCardSkeleton />
                                )}
                            </View>
                        );
                    }

                    return item ? (
                        <ListEntryRow
                            entry={item}
                            contentType={contentType}
                            owner={owner}
                            showStatus={status === USER_LIST_ALL_STATUS}
                        />
                    ) : (
                        <ListEntryRowSkeleton
                            badge={status === USER_LIST_ALL_STATUS}
                        />
                    );
                }}
                ListHeaderComponent={
                    <View
                        className={grid ? '-mx-2.5 gap-1 pb-3' : 'gap-1 pb-3'}
                    >
                        <View className="px-4 pt-2 pb-2">
                            <SegmentedControl
                                options={TYPES}
                                value={contentType}
                                onValueChange={(next) =>
                                    router.setParams({
                                        content_type: next,
                                        status: resolveListStatus(next, status),
                                    })
                                }
                            />
                        </View>
                        <ListStatusChips
                            username={username}
                            contentType={contentType}
                            status={status}
                            onStatusChange={setStatus}
                        />
                    </View>
                }
                ListEmptyComponent={
                    error ? (
                        <ErrorState
                            error={error}
                            onRetry={onRetry}
                            title="Не вдалося завантажити список"
                            className="mt-8"
                        />
                    ) : filtered ? (
                        <EmptyState
                            className={grid ? 'mx-1.5 mt-4' : 'mx-4 mt-4'}
                            bordered
                            icon={<Icon as={Bookmark} />}
                            title="Не знайдено результатів за Вашим запитом"
                            description="Очистіть або змініть фільтри, щоб отримати інший результат"
                            action={
                                <Button
                                    variant="secondary"
                                    onPress={() => updateFilters(clearFilters)}
                                >
                                    Очистити
                                </Button>
                            }
                        />
                    ) : (
                        <EmptyState
                            className={grid ? 'mx-1.5 mt-4' : 'mx-4 mt-4'}
                            bordered
                            icon={<Icon as={Bookmark} />}
                            title={
                                label
                                    ? `У списку «${label}» пусто`
                                    : 'Список пустий'
                            }
                            description={`Цей список оновиться після того, як сюди буде додано ${CONTENT_TYPES[contentType].accusative}${label ? ' з цим статусом' : ''}`}
                        />
                    )
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator className="py-4" />
                    ) : null
                }
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </>
    );
};

export default UserListPage;
