'use client';

import React from 'react';
import MaterialSymbolsNotificationsRounded from '~icons/material-symbols/notifications-rounded';

import NotFoundNotifications from '@/app/(pages)/components/navbar/components/notifications-menu/components/not-found-notifications';
import NotificationItem from '@/app/(pages)/components/navbar/components/notifications-menu/components/ui/notification-item';
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
import useNotifications from '@/services/hooks/notifications/useNotifications';
import useNotificationsCount from '@/services/hooks/notifications/useNotificationsCount';
import useSeenNotification from '@/services/hooks/notifications/useSeenNotification';
import { convertNotification } from '@/utils/convertNotification';

interface Props {}

const Component = ({}: Props) => {
    const { data: countData } = useNotificationsCount();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        refetch,
        ref,
    } = useNotifications();

    const { mutate: asSeen } = useSeenNotification();

    return (
        <DropdownMenu onOpenChange={(open) => open && refetch()}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-md" className="relative">
                    <MaterialSymbolsNotificationsRounded />
                    {countData && countData.unseen > 0 && (
                        <div className="absolute right-0 top-0 size-2 rounded-full bg-warning" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="flex max-h-96 w-80 flex-col sm:w-96"
            >
                <DropdownMenuLabel className="-m-1 flex items-center justify-between gap-2 bg-secondary/30 px-3 py-3.5">
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
                            onClick={() =>
                                asSeen({ reference: list![0].reference })
                            }
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

export default Component;
