'use client';

import { FC, ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

import { accentBadgeClasses } from '../utils/notification-accents';

interface Props {
    actor?: Hikka.NotificationActor;
    contentImage?: string;
    typeIcon: ReactNode;
    accent: Hikka.NotificationAccent;
}

const NotificationLeadingVisual: FC<Props> = ({
    actor,
    contentImage,
    typeIcon,
    accent,
}) => {
    const hasImage = Boolean(actor?.avatar || contentImage);

    return (
        <div className="relative size-10 shrink-0">
            {actor?.avatar || contentImage ? (
                <Avatar className="size-10 rounded-md">
                    <AvatarImage
                        className="rounded-md object-cover"
                        src={actor?.avatar ?? contentImage}
                        alt={actor?.avatar ? actor.username : ''}
                    />
                    <AvatarFallback>{typeIcon}</AvatarFallback>
                </Avatar>
            ) : (
                <div className="border-border bg-secondary/40 flex size-10 items-center justify-center rounded-md border [&_svg]:size-5">
                    {typeIcon}
                </div>
            )}

            {hasImage && (
                <div
                    className={cn(
                        'absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-sm border [&_svg]:size-2.5',
                        accentBadgeClasses[accent],
                    )}
                >
                    {typeIcon}
                </div>
            )}
        </div>
    );
};

export default NotificationLeadingVisual;
