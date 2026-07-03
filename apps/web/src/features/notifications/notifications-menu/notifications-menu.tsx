import { type FC, useMemo, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    type NotificationResponse,
    notificationSeenMutation,
    notificationsInfiniteOptions,
    unseenNotificationsCountOptions,
} from '@hikka/api';

import MaterialSymbolsNotificationsRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationsRounded';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaQuery } from '@/services/hooks/use-media-query';
import { convertNotification } from '@/utils/adapters/convert-notification';
import { invalidateNotifications } from '@/utils/api/invalidate-content-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import NotificationsContent from './components/notifications-content';
import NotificationsHeader from './components/notifications-header';
import { groupNotificationsByDay } from './utils/group-notifications-by-day';

const NotificationsMenu: FC = () => {
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

    const triggerButton = (
        <Button variant="outline" size="icon-md" className="relative">
            <MaterialSymbolsNotificationsRounded />
            {unseenCount > 0 && (
                <div className="absolute -right-0.5 -bottom-0.5 rounded-full border border-warning-border bg-warning p-0.5 px-1 font-bold text-[0.6rem] text-warning-foreground leading-none">
                    {unseenCount < 100 ? unseenCount : '99+'}
                </div>
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
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
            <DrawerContent className="max-h-[85dvh]">
                <DrawerHeader className="border-border border-b p-0">
                    <DrawerTitle className="sr-only">Сповіщення</DrawerTitle>

                    <NotificationsHeader
                        unseenCount={unseenCount}
                        isBulkMarking={isBulkMarking}
                        onMarkAllSeen={handleMarkAllSeen}
                        className="px-4 py-4"
                    />
                </DrawerHeader>
                <NotificationsContent
                    normalized={normalized}
                    grouped={grouped}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    loadMoreRef={ref}
                    onNavigate={() => setIsOpen(false)}
                />
            </DrawerContent>
        </Drawer>
    );
};

export default NotificationsMenu;
