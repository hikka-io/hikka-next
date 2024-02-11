'use client';

import { formatDistance } from 'date-fns';
import React from 'react';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import seenNotification from '@/services/api/notifications/seenNotification';
import { useAuthContext } from '@/services/providers/auth-provider';
import { Label } from '@/components/ui/label';

interface Props {
    data: Hikka.TextNotification;
}

const Component = ({ data }: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const router = useRouter();

    const { mutate: asSeen } = useMutation({
        mutationFn: () =>
            seenNotification({
                reference: data.reference,
                secret: String(secret),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications', secret],
            });

            queryClient.invalidateQueries({
                queryKey: ['notificationsCount', secret],
            });
        },
    });

    const handleOnClick = () => {
        if (!data.seen) {
            asSeen();
        }

        router.push(data.href);
    };

    return (
        <DropdownMenuItem
            className="flex gap-4 items-start py-3"
            onClick={handleOnClick}
        >
            <div className="border-secondary/60 bg-secondary/30 p-2 rounded-md">
                {data.icon}
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2 items-center">
                    <Label>{data.title}</Label>
                    {!data.seen && (
                        <div className="w-2 h-2 bg-warning rounded-full" />
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    {data.description}
                </p>
                <p className="text-xs text-muted-foreground opacity-60">
                    {formatDistance(data.created * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </p>
            </div>
        </DropdownMenuItem>
    );
};

export default Component;
