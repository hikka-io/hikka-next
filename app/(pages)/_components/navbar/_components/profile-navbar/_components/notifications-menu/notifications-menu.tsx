'use client';

import React from 'react';
import MaterialSymbolsNotificationsRounded from '~icons/material-symbols/notifications-rounded';

import { useQueryClient } from '@tanstack/react-query';

import {
    useInvalidateNotifications,
    useNotifications,
    useNotificationsCount,
    useSeenNotification,
} from '@/app/(pages)/_components/navbar/_components/profile-navbar/_components/notifications-menu/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/services/providers/auth-provider';
import { convertNotification } from '@/utils/convertNotification';

import NotFoundNotifications from './_components/not-found-notifications';
import NotificationItem from './_components/ui/notification-item';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {}

const Component = ({}: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();

    const { data: countData } = useNotificationsCount(String(secret));

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useNotifications(String(secret));

    const { mutate: asSeen } = useSeenNotification(String(secret));
    const invalidate = useInvalidateNotifications(String(secret));

    return (
        <DropdownMenu onOpenChange={(open) => open && invalidate()}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-md" className="relative">
                    <MaterialSymbolsNotificationsRounded />
                    {countData && countData.unseen > 0 && (
                        <div className="w-2 h-2 rounded-full absolute top-0 right-0 bg-warning" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 sm:w-96 max-h-96 flex flex-col"
            >
                <DropdownMenuLabel className="flex gap-2 items-center justify-between">
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
                <div className='overflow-scroll h-full no-scrollbar'>
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
                        <div className='py-3 px-2'>
                            <Button
                                variant='outline'
                                disabled={isFetchingNextPage}
                                onClick={() => hasNextPage && fetchNextPage()}
                                className='w-full'
                            >
                                {isFetchingNextPage && (
                                    <span className='loading loading-spinner'></span>
                                )}
                                Завантажити ще
                            </Button>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Component;
