import type { AnimationEvent, FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationSeenMutation } from '@hikka/api';
import {
    getDeclensionWord,
    getNotificationGroupActors,
    getNotificationGroupDescription,
} from '@hikka/core';

import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import { MDViewer } from '@/components/markdown';
import RelativeTime from '@/components/relative-time';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { invalidateNotifications } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';

import { ACCENT_BADGE_CLASSES } from '../notification-accents';
import type { Notification } from '../types';
import NotificationItem from './notification-item';
import NotificationLeadingVisual from './notification-leading-visual';

type Props = {
    // Newest first, as the list delivers them; always two or more.
    items: Notification[];
    onNavigate?: () => void;
};

const UNSEEN_FORMS = ['нове', 'нові', 'нових'] as const;

const StackAvatar: FC<{ src?: string; alt?: string; className: string }> = ({
    src,
    alt,
    className,
}) => (
    <Avatar className={cn('absolute size-7 rounded-md', className)}>
        <AvatarImage className="rounded-md object-cover" src={src} alt={alt} />
        <AvatarFallback className="rounded-md bg-secondary font-medium text-xs uppercase">
            {alt?.[0]}
        </AvatarFallback>
    </Avatar>
);

// Two newest actors overlap diagonally in the same 40px slot, so rows stay aligned with single items.
const GroupLeadingVisual: FC<{ items: Notification[] }> = ({ items }) => {
    const [latest] = items;
    const [front, back] = getNotificationGroupActors(items);
    if (!back)
        return (
            <NotificationLeadingVisual
                actor={latest.actor}
                contentImage={latest.contentImage}
                typeIcon={latest.typeIcon}
                accent={latest.accent}
            />
        );

    return (
        <div className="relative size-10 shrink-0">
            <StackAvatar
                src={back.avatar}
                alt={back.username}
                className="top-0 left-0"
            />
            <StackAvatar
                src={front.avatar}
                alt={front.username}
                className="right-0 bottom-0 ring-2 ring-popover"
            />
            <div
                className={cn(
                    'absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-sm border [&_svg]:size-2.5',
                    ACCENT_BADGE_CLASSES[latest.accent],
                )}
            >
                {latest.typeIcon}
            </div>
        </div>
    );
};

const NotificationGroup: FC<Props> = ({ items, onNavigate }) => {
    const queryClient = useQueryClient();
    const { mutateAsync: markSeen } = useMutation(notificationSeenMutation());

    const [latest] = items;
    const unseen = items.filter((item) => !item.seen);
    // Groups never mix upvotes and downvotes, so the sum is the signed count.
    const score = latest.scoreSign ? latest.scoreSign * items.length : 0;

    const handleAnimationEnd = async (
        event: AnimationEvent<HTMLDivElement>,
    ) => {
        if (
            event.target !== event.currentTarget ||
            event.animationName !== 'collapsible-panel-down' ||
            unseen.length === 0
        )
            return;
        await Promise.allSettled(
            unseen.map((item) =>
                markSeen({ path: { notification_reference: item.reference } }),
            ),
        );
        await invalidateNotifications(queryClient);
    };

    return (
        <Collapsible className="border-border border-t first:border-t-0">
            <CollapsibleTrigger
                nativeButton={false}
                render={<div />}
                className={cn(
                    'group/item flex w-full cursor-pointer gap-3 border-l-4 px-3 py-2.5 text-left outline-none transition-colors focus-visible:bg-muted',
                    unseen.length > 0
                        ? 'border-l-primary-foreground/60 bg-primary-foreground/10'
                        : 'border-l-transparent',
                    'hover:bg-muted',
                )}
            >
                <GroupLeadingVisual items={items} />

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium text-sm leading-tight">
                            {latest.title}
                        </span>
                        <div className="flex shrink-0 items-center gap-1">
                            <span
                                className={cn(
                                    'rounded-sm border px-1 font-bold text-xs tabular-nums',
                                    score > 0
                                        ? ACCENT_BADGE_CLASSES.success
                                        : score < 0
                                          ? ACCENT_BADGE_CLASSES.destructive
                                          : ACCENT_BADGE_CLASSES.neutral,
                                )}
                            >
                                {score > 0
                                    ? `+${score}`
                                    : score < 0
                                      ? score
                                      : items.length}
                            </span>
                            <MaterialSymbolsKeyboardArrowDownRounded className="size-5 text-muted-foreground transition-transform group-hover/item:text-foreground group-data-panel-open/item:rotate-180" />
                        </div>
                    </div>
                    <MDViewer
                        preview
                        className="prose-inline line-clamp-2 text-muted-foreground text-xs! group-hover/item:text-foreground"
                    >
                        {getNotificationGroupDescription(items)}
                    </MDViewer>
                    <div className="flex items-center gap-1.5 text-xs">
                        <RelativeTime
                            value={latest.created}
                            className="opacity-60 group-hover/item:opacity-100"
                        />
                        {unseen.length > 0 && unseen.length < items.length && (
                            <span className="font-medium text-primary-foreground">
                                · {unseen.length}{' '}
                                {getDeclensionWord(unseen.length, UNSEEN_FORMS)}
                            </span>
                        )}
                    </div>
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent
                keepMounted
                onAnimationEnd={handleAnimationEnd}
                className="overflow-hidden border-border border-t data-closed:animate-collapsible-up data-open:animate-collapsible-down"
            >
                {items.map((item) => (
                    <NotificationItem
                        key={item.reference}
                        data={item}
                        onNavigate={onNavigate}
                        className="pl-8"
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default NotificationGroup;
