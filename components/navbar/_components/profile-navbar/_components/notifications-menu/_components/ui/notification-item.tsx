'use client';

import { formatDistance } from 'date-fns';
import React from 'react';

import { useRouter } from 'next/navigation';

import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import useSeenNotification from '@/services/hooks/notifications/useSeenNotification';

interface Props {
    data: Hikka.TextNotification;
}

const Component = ({ data }: Props) => {
    const router = useRouter();

    const { mutate: asSeen } = useSeenNotification();

    const handleOnClick = () => {
        if (!data.seen) {
            asSeen({
                reference: data.reference,
            });
        }
        router.push(data.href);
    };

    return (
        <DropdownMenuItem
            className="flex items-start gap-4 py-3"
            onClick={handleOnClick}
        >
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
                {data.icon}
            </div>
            <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="leading-normal">{data.title}</Label>
                    {!data.seen && (
                        <div className="size-2 rounded-full bg-warning" />
                    )}
                </div>
                <P className="text-sm text-muted-foreground">
                    {data.description}
                </P>
                <Small className="text-muted-foreground opacity-60">
                    {formatDistance(data.created * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </Small>
            </div>
        </DropdownMenuItem>
    );
};

export default Component;
