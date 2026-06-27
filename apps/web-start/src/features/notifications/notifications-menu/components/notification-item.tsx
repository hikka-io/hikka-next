import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistance } from 'date-fns/formatDistance';

import { notificationSeenMutation } from '@hikka/api';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import { HorizontalCardDescription } from '@/components/ui/horizontal-card';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import { accentBadgeClasses } from '../utils/notification-accents';
import NotificationLeadingVisual from './notification-leading-visual';

type Props = {
    data: Hikka.Notification;
    onNavigate?: () => void;
};

const NotificationItem: FC<Props> = ({ data, onNavigate }) => {
    const queryClient = useQueryClient();
    const { mutate: markSeen } = useMutation({
        ...notificationSeenMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const id = (
                        query.queryKey[0] as { _id?: string } | undefined
                    )?._id;
                    return (
                        id === 'notifications' ||
                        id === 'unseenNotificationsCount'
                    );
                },
            });
        },
    });

    const handleNotificationClick = () => {
        if (!data.seen)
            markSeen({ path: { notification_reference: data.reference } });
        onNavigate?.();
    };

    const leadingVisual = (
        <NotificationLeadingVisual
            actor={data.actor}
            contentImage={data.contentImage}
            typeIcon={data.typeIcon}
            accent={data.accent}
        />
    );

    return (
        <div
            className={cn(
                'group/item flex gap-3 border-border border-t border-l-4 px-3 py-2.5 transition-colors first:border-t-0',
                data.seen
                    ? 'border-l-transparent'
                    : 'border-l-primary-foreground/60 bg-primary-foreground/10',
                'hover:bg-muted',
            )}
        >
            {data.actor?.href ? (
                <Link
                    to={data.actor.href}
                    onClick={() => onNavigate?.()}
                    className="shrink-0"
                    aria-label={data.actor.username}
                >
                    {leadingVisual}
                </Link>
            ) : (
                leadingVisual
            )}

            <div className="relative flex min-w-0 flex-1 flex-col gap-1">
                <Link
                    to={data.href}
                    onClick={handleNotificationClick}
                    aria-label={data.title}
                    className="absolute inset-0 z-10"
                />
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm leading-tight">
                        {data.title}
                    </span>
                    {data.scoreSign && (
                        <span
                            className={cn(
                                'shrink-0 rounded-sm border px-1 font-bold text-xs',
                                data.scoreSign > 0
                                    ? accentBadgeClasses.success
                                    : accentBadgeClasses.destructive,
                            )}
                        >
                            {data.scoreSign > 0 ? '+1' : '-1'}
                        </span>
                    )}
                </div>
                <HorizontalCardDescription className="line-clamp-2 group-hover/item:text-foreground">
                    {data.description}
                </HorizontalCardDescription>
                {data.preview && (
                    <blockquote className="mt-0.5 line-clamp-1 border-muted-foreground/20 border-l-2 pl-2">
                        <MDViewer
                            preview
                            className="text-muted-foreground text-xs!"
                        >
                            {data.preview}
                        </MDViewer>
                    </blockquote>
                )}
                <HorizontalCardDescription className="opacity-60 group-hover/item:opacity-100">
                    {formatDistance(data.created * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </HorizontalCardDescription>
            </div>
        </div>
    );
};

export default NotificationItem;
