'use client';

import { useMarkNotificationAsSeen } from '@hikka/react';
import { formatDistance } from 'date-fns/formatDistance';
import Link from 'next/link';
import { FC } from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {
    data: Hikka.TextNotification | null;
}

const NotificationItem: FC<Props> = ({ data }) => {
    const { mutate: asSeen } = useMarkNotificationAsSeen();

    if (!data) {
        return null;
    }

    const handleOnClick = () => {
        if (!data.seen) {
            asSeen(data.reference);
        }
    };

    return (
        <DropdownMenuItem
            className="flex items-center gap-4 py-3"
            onClick={handleOnClick}
            asChild
        >
            <Link href={data.href} prefetch>
                <HorizontalCard className="w-full" href={data.href}>
                    <HorizontalCardImage
                        image={data.icon}
                        imageRatio={1}
                        imageClassName="overflow-visible"
                        className="w-8"
                    >
                        {!data.seen && (
                            <div className="border-border bg-warning absolute -bottom-0.5 -right-0.5 size-2 rounded-full border" />
                        )}
                    </HorizontalCardImage>
                    <HorizontalCardContainer>
                        <HorizontalCardTitle>{data.title}</HorizontalCardTitle>
                        <HorizontalCardDescription className="line-clamp-2">
                            {data.description}
                        </HorizontalCardDescription>
                        <HorizontalCardDescription className="opacity-60">
                            {formatDistance(data.created * 1000, Date.now(), {
                                addSuffix: true,
                            })}
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                    {data.image && data.image}
                </HorizontalCard>
            </Link>
        </DropdownMenuItem>
    );
};

export default NotificationItem;
