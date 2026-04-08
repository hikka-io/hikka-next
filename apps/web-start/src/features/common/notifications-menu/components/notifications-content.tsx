'use client';

import { FC, Fragment, Ref } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { GroupedNotifications } from '../utils/group-notifications-by-day';
import NotFoundNotifications from './not-found-notifications';
import NotificationItem from './notification-item';
import NotificationItemSkeleton from './notification-item-skeleton';

interface Props {
    normalized: Hikka.Notification[] | undefined;
    grouped: GroupedNotifications;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    loadMoreRef: Ref<HTMLButtonElement>;
    onNavigate?: () => void;
}

const SECTION_LABELS: Record<keyof GroupedNotifications, string> = {
    today: 'Сьогодні',
    yesterday: 'Вчора',
    earlier: 'Раніше',
};

const SECTION_ORDER: (keyof GroupedNotifications)[] = [
    'today',
    'yesterday',
    'earlier',
];

const NotificationsContent: FC<Props> = ({
    normalized,
    grouped,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
    onNavigate,
}) => {
    return (
        <div className="no-scrollbar -m-4 flex h-full flex-1 flex-col overflow-y-auto md:m-0">
            {normalized === undefined ? (
                <>
                    <NotificationItemSkeleton />
                    <NotificationItemSkeleton />
                    <NotificationItemSkeleton />
                </>
            ) : normalized.length === 0 ? (
                <NotFoundNotifications />
            ) : (
                SECTION_ORDER.map((sectionKey) => {
                    const items = grouped[sectionKey];
                    if (items.length === 0) return null;
                    return (
                        <Fragment key={sectionKey}>
                            <div className="text-muted-foreground bg-secondary/20 border-border border-b px-3 py-1.5 text-xs font-medium">
                                {SECTION_LABELS[sectionKey]}
                            </div>
                            {items.map((item) => (
                                <NotificationItem
                                    key={item.reference}
                                    data={item}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </Fragment>
                    );
                })
            )}
            {hasNextPage && (
                <div className="px-2 py-3">
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={loadMoreRef}
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationsContent;
