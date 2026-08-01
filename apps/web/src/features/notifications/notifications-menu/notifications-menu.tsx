import { type FC, type ReactNode, useMemo, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    type NotificationResponse,
    notificationSeenMutation,
    notificationsInfiniteOptions,
    unseenNotificationsCountOptions,
} from '@hikka/api';

import MaterialSymbolsNotificationsRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationsRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    PageSheet,
    PageSheetContent,
    PageSheetHeader,
    PageSheetTrigger,
} from '@/components/ui/page-sheet';
import { useMediaQuery } from '@/services/hooks/use-media-query';
import { convertNotification } from '@/utils/adapters/convert-notification';
import { invalidateNotifications } from '@/utils/api/invalidate-content-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import NotificationCountBadge from '../notification-count-badge';
import NotificationsContent from './components/notifications-content';
import NotificationsHeader from './components/notifications-header';
import { groupNotificationsByDay } from './utils/group-notifications-by-day';

type Props = {
    trigger?: (unseenCount: number) => ReactNode;
};

const NotificationsMenu: FC<Props> = ({ trigger }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [isOpen, setIsOpen] = useState(false);
    const [isBulkMarking, setIsBulkMarking] = useState(false);

    const queryClient = useQueryClient();

    const { data: countData } = useQuery(unseenNotificationsCountOptions());

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useInfiniteList(notificationsInfiniteOptions(), { enabled: isOpen });

    const { mutateAsync: markSeen } = useMutation({
        ...notificationSeenMutation(),
        onSuccess: () => invalidateNotifications(queryClient),
    });

    const { normalized, grouped } = useMemo(() => {
        const items = (list as NotificationResponse[] | undefined)
            ?.map((n) => convertNotification(n))
            .filter((n): n is Hikka.Notification => n !== null);
        return {
            normalized: items,
            grouped: groupNotificationsByDay(items ?? []),
        };
    }, [list]);

    const unseenCount = countData?.unseen ?? 0;

    const handleMarkAllSeen = async () => {
        if (!normalized) return;
        const unseen = normalized.filter((n) => !n.seen);
        if (unseen.length === 0) return;
        setIsBulkMarking(true);
        try {
            await Promise.allSettled(
                unseen.map((n) =>
                    markSeen({
                        path: { notification_reference: n.reference },
                    }),
                ),
            );
        } finally {
            setIsBulkMarking(false);
        }
    };

    const triggerButton = trigger ? (
        trigger(unseenCount)
    ) : (
        <Button
            variant="outline"
            size="icon-md"
            className="lifted-edges relative rounded-md"
        >
            <MaterialSymbolsNotificationsRounded />
            {unseenCount > 0 && (
                <NotificationCountBadge
                    count={unseenCount}
                    className="-right-1 -bottom-1 absolute"
                />
            )}
        </Button>
    );

    if (isDesktop) {
        return (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    {triggerButton}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="flex max-h-128 w-80 flex-col p-0 sm:w-96"
                >
                    <NotificationsHeader
                        unseenCount={unseenCount}
                        isBulkMarking={isBulkMarking}
                        onMarkAllSeen={handleMarkAllSeen}
                        className="surface-inset px-3 py-3.5"
                    />
                    <DropdownMenuSeparator className="m-0" />
                    <NotificationsContent
                        normalized={normalized}
                        grouped={grouped}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        loadMoreRef={ref}
                        onNavigate={() => setIsOpen(false)}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <PageSheet open={isOpen} onOpenChange={setIsOpen}>
            <PageSheetTrigger asChild>{triggerButton}</PageSheetTrigger>
            <PageSheetContent>
                <PageSheetHeader
                    title="Сповіщення"
                    actions={
                        unseenCount > 0 && (
                            <>
                                <Badge variant="warning">{unseenCount}</Badge>
                                <Button
                                    size="badge"
                                    variant="outline"
                                    disabled={isBulkMarking}
                                    onClick={handleMarkAllSeen}
                                >
                                    Прочитати всі
                                </Button>
                            </>
                        )
                    }
                />
                <NotificationsContent
                    normalized={normalized}
                    grouped={grouped}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    loadMoreRef={ref}
                    onNavigate={() => setIsOpen(false)}
                />
            </PageSheetContent>
        </PageSheet>
    );
};

export default NotificationsMenu;
