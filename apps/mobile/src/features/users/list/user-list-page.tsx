import { type FC, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';
import { Bookmark } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import {
    CONTENT_TYPES,
    DEFAULT_USER_LIST_STATUS,
    getSort,
    type SortOrder,
    USER_LIST_ALL_STATUS,
} from '@hikka/core';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import HistoryRowSkeleton from '@/components/list-items/history-row-skeleton';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';
import { renderViewSortMenu } from '@/components/view-sort-menu';
import { useSession } from '@/features/auth';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { byUsername, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';
import { useRefetchStaleOnFocus } from '@/utils/api/use-refetch-stale-on-focus';

import { statusLabel, statusOrder } from '../list-status';
import {
    DEFAULT_PAGE_SIZE,
    type ListContentType,
    type UserListEntry,
    userListOptions,
} from '../queries';
import ListEntryPoster from './list-entry-poster';
import ListEntryRow from './list-entry-row';
import ListStatusChips from './list-status-chips';
import { type UserListView, useUserListPrefs } from './user-list-prefs-store';

const TYPES = [
    { label: 'Аніме', value: ContentTypeEnum.ANIME },
    { label: 'Манґа', value: ContentTypeEnum.MANGA },
    { label: 'Ранобе', value: ContentTypeEnum.NOVEL },
];

const VIEWS: { value: UserListView; label: string; icon: SFSymbol }[] = [
    { value: 'list', label: 'Список', icon: 'list.bullet' },
    { value: 'grid', label: 'Сітка', icon: 'square.grid.2x2' },
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

    const { items, error, isFetchingNextPage, onEndReached, onRetry } =
        useInfiniteList<UserListEntry>(
            userListOptions(username, contentType, { status, sort, order }),
        );
    const { refreshing, onRefresh } = usePullToRefresh(byUsername([username]));
    useRefetchStaleOnFocus(username, byUsername([username]));
    const data: (UserListEntry | null)[] =
        items ?? (error ? [] : SKELETON_ITEMS);
    const kind = contentType === ContentTypeEnum.ANIME ? 'watch' : 'read';
    const label =
        status === USER_LIST_ALL_STATUS
            ? undefined
            : statusLabel(contentType, status);

    return (
        <>
            <Stack.Title>{`Список ${CONTENT_TYPES[contentType].genitive}`}</Stack.Title>
            <Stack.Toolbar placement="right">
                {renderViewSortMenu({
                    views: VIEWS,
                    view,
                    onViewChange: setView,
                    sortOptions: getSort(kind),
                    sort,
                    onSortChange: setSort,
                    order,
                    onOrderChange: setOrder,
                })}
            </Stack.Toolbar>
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
                        <HistoryRowSkeleton className="px-4 py-2" />
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
