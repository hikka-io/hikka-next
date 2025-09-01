'use client';

import {
    useNotificationList,
    useUnseenNotificationsCount,
    useUpdateNotificationSeen,
} from '@hikka/react';

import MaterialSymbolsNotificationsRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationsRounded';
import LoadMoreButton from '@/components/load-more-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { convertNotification } from '@/utils/adapters/convert-notification';

import NotFoundNotifications from './not-found-notifications';
import NotificationItem from './notification-item';

const NotificationsMenu = () => {
    const { data: countData } = useUnseenNotificationsCount();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        refetch,
        ref,
    } = useNotificationList();

    const { mutate: asSeen } = useUpdateNotificationSeen();

    return (
        <DropdownMenu onOpenChange={(open) => open && refetch()}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-md" className="relative">
                    <MaterialSymbolsNotificationsRounded />
                    {countData && countData.unseen > 0 && (
                        <div className="absolute -bottom-0.5 -right-0.5 rounded-full border border-warning-border bg-warning p-0.5 px-1 text-[0.6rem] font-bold leading-none text-warning-foreground">
                            {countData.unseen < 100 ? countData.unseen : '99+'}
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="flex max-h-96 w-80 flex-col sm:w-96"
            >
                <DropdownMenuLabel className="-m-1 flex items-center justify-between gap-2 bg-secondary/20 px-3 py-3.5">
                    <div className="flex gap-2">
                        Сповіщення
                        {countData && countData.unseen > 0 && (
                            <Badge variant="warning">{countData.unseen}</Badge>
                        )}
                    </div>
                    {countData && countData.unseen > 0 && (
                        <Button
                            size="badge"
                            variant="outline"
                            onClick={() => asSeen(list![0].reference)}
                        >
                            Прочитати
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="no-scrollbar h-full overflow-scroll">
                    {list &&
                        list.length > 0 &&
                        list.map((item) => (
                            <NotificationItem
                                key={item.reference}
                                data={convertNotification(item)}
                            />
                        ))}
                    {list && list.length === 0 && <NotFoundNotifications />}
                    {hasNextPage && (
                        <div className="px-2 py-3">
                            <LoadMoreButton
                                isFetchingNextPage={isFetchingNextPage}
                                fetchNextPage={fetchNextPage}
                                ref={ref}
                            />
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationsMenu;
