'use client';

import Link from 'next/link';
import { FC } from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import HorizontalCard from '@/components/ui/horizontal-card';

import useSeenNotification from '@/services/hooks/notifications/use-seen-notification';

interface Props {
    data: Hikka.TextNotification;
}

const NotificationItem: FC<Props> = ({ data }) => {
    const { mutate: asSeen } = useSeenNotification();

    const handleOnClick = () => {
        if (!data.seen) {
            asSeen({
                reference: data.reference,
            });
        }
    };

    return (
        <DropdownMenuItem
            className="flex items-center gap-4 py-3"
            onClick={handleOnClick}
            asChild
        >
            <Link href={data.href} prefetch>
                <HorizontalCard
                    className="w-full"
                    title={data.title}
                    href={data.href}
                    description={data.description}
                    descriptionClassName="line-clamp-2"
                    createdAt={data.created}
                    image={data.icon}
                    imageRatio={1}
                    imageClassName="overflow-visible"
                    imageContainerClassName="w-8"
                    imageChildren={
                        !data.seen && (
                            <div className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-secondary/60 bg-warning" />
                        )
                    }
                >
                    {data.image && data.image}
                </HorizontalCard>
            </Link>
        </DropdownMenuItem>
    );
};

export default NotificationItem;
