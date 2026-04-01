'use client';

import { useState } from 'react';

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

import NotFoundNotifications from './components/not-found-notifications';
import NotificationItem from './components/notification-item';

const NotificationsMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: countData } = useUnseenNotificationsCount();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        ref,
    } = useNotificationList({
        options: { enabled: isOpen },
    });

    const { mutate: asSeen } = useUpdateNotificationSeen();

    return (
        <DropdownMenu onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-md" className="relative">
                    <MaterialSymbolsNotificationsRounded />
                    {countData && countData.unseen > 0 && (
                        <div className="border-warning-border bg-warning text-warning-foreground absolute -right-0.5 -bottom-0.5 rounded-full border p-0.5 px-1 text-[0.6rem] leading-none font-bold">
                            {countData.unseen < 100 ? countData.unseen : '99+'}
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="flex max-h-96 w-80 flex-col sm:w-96"
            >
                <DropdownMenuLabel className="bg-secondary/20 -m-1 flex items-center justify-between gap-2 px-3 py-3.5">
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
