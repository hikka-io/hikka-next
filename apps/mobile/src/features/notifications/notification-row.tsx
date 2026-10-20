import type { FC } from 'react';

import { View } from 'react-native';

import { formatTimeAgo, type NotificationItem } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { MDViewer, markdownPreview, useOpenLink } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import {
    ACCENT_BADGE_CLASSES,
    ACCENT_ICON_CLASSES,
    notificationIcon,
} from './notification-icons';
import { notificationUrl } from './notification-url';
import { useMarkNotificationsSeen } from './use-notification-mutations';

const DESCRIPTION_CLASS = 'text-sm leading-5 text-muted-foreground';

type Props = {
    item: NotificationItem;
};

const LeadingVisual: FC<Props> = ({ item }) => {
    const image = item.actor?.avatar ?? item.contentImage;
    const Glyph = notificationIcon(item);
    const glyph = (
        <Icon
            as={Glyph}
            className={cn('size-5', ACCENT_ICON_CLASSES[item.accent])}
        />
    );

    return (
        <View className="size-10 self-start">
            <Avatar className="size-10 rounded-md">
                <AvatarImage
                    src={image}
                    size={40}
                    alt={item.actor?.username}
                    className="rounded-md"
                />
                <AvatarFallback
                    className={cn(
                        'rounded-md border',
                        ACCENT_BADGE_CLASSES[item.accent],
                    )}
                >
                    {glyph}
                </AvatarFallback>
            </Avatar>
            {image ? (
                <View
                    className={cn(
                        'absolute -right-0.5 -bottom-0.5 size-4 items-center justify-center rounded-sm border',
                        ACCENT_BADGE_CLASSES[item.accent],
                    )}
                >
                    <Icon
                        as={Glyph}
                        className={cn(
                            'size-2.5',
                            ACCENT_ICON_CLASSES[item.accent],
                        )}
                    />
                </View>
            ) : null}
        </View>
    );
};

const ScoreSign: FC<{ sign: 1 | -1 }> = ({ sign }) => (
    <View
        className={cn(
            'rounded-sm border px-1',
            sign > 0
                ? 'border-success-border bg-success'
                : 'border-destructive-border bg-destructive',
        )}
    >
        <Text
            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
            className={cn(
                'font-bold text-xs',
                sign > 0
                    ? 'text-success-foreground'
                    : 'text-destructive-foreground',
            )}
        >
            {sign > 0 ? '+1' : '-1'}
        </Text>
    </View>
);

/** The web's `NotificationItem`: actor or content visual, title, copy, quoted text and the time since. */
const NotificationRow: FC<Props> = ({ item }) => {
    const openLink = useOpenLink();
    const { mutate: markSeen } = useMarkNotificationsSeen();
    const preview = item.preview ? markdownPreview(item.preview) : '';

    const open = () => {
        if (!item.seen) {
            markSeen({ reference: item.reference, created: item.created });
        }

        const url = notificationUrl(item.href);
        if (url) openLink(url);
    };

    return (
        <HorizontalCard
            onPress={open}
            className={cn(
                'items-start border-l-4 px-4 py-3',
                item.seen
                    ? 'border-l-transparent'
                    : 'border-l-primary-foreground/60 bg-primary-foreground/10',
            )}
        >
            <LeadingVisual item={item} />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle
                    titleMeta={
                        item.scoreSign ? (
                            <ScoreSign sign={item.scoreSign} />
                        ) : null
                    }
                >
                    {item.title}
                </HorizontalCardTitle>
                <MDViewer textClassName={DESCRIPTION_CLASS}>
                    {item.description}
                </MDViewer>
                {preview ? (
                    <View className="border-muted-foreground/20 border-l-2 pl-2">
                        <Text
                            numberOfLines={2}
                            className="text-muted-foreground text-xs"
                        >
                            {preview}
                        </Text>
                    </View>
                ) : null}
                <Text
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="text-muted-foreground/70 text-xs"
                >
                    {formatTimeAgo(item.created, Date.now())}
                </Text>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default NotificationRow;
