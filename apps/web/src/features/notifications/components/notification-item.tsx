import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationSeenMutation } from '@hikka/api';

import { HorizontalCardDescription } from '@/components/horizontal-card';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import RelativeTime from '@/components/relative-time';
import { invalidateNotifications } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import type { Notification } from '../types';
import { ACCENT_BADGE_CLASSES } from '../utils/notification-accents';
import NotificationLeadingVisual from './notification-leading-visual';

type Props = {
    data: Notification;
    onNavigate?: () => void;
};

const NotificationItem: FC<Props> = ({ data, onNavigate }) => {
    const queryClient = useQueryClient();
    const { mutate: markSeen } = useMutation({
        ...notificationSeenMutation(),
        onSuccess: () => invalidateNotifications(queryClient),
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
                                    ? ACCENT_BADGE_CLASSES.success
                                    : ACCENT_BADGE_CLASSES.destructive,
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
                    <blockquote className="mt-0.5 border-muted-foreground/20 border-l-2 pl-2">
                        <MDViewer
                            preview
                            className="prose-inline line-clamp-1 text-muted-foreground text-xs!"
                        >
                            {data.preview}
                        </MDViewer>
                    </blockquote>
                )}
                <RelativeTime
                    value={data.created}
                    className="opacity-60 group-hover/item:opacity-100"
                />
            </div>
        </div>
    );
};

export default NotificationItem;
