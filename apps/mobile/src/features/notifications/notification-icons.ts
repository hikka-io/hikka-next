import {
    AtSign,
    CircleCheck,
    Flag,
    Heart,
    HeartMinus,
    HeartPlus,
    Info,
    LockKeyholeOpen,
    type LucideIcon,
    MessageSquarePlus,
    RefreshCw,
    Tv,
    UserPlus,
} from 'lucide-react-native';

import { NotificationTypeEnum } from '@hikka/api';
import type { NotificationAccent, NotificationItem } from '@hikka/core';

const TYPE_ICONS: Record<NotificationTypeEnum, LucideIcon> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: CircleCheck,
    [NotificationTypeEnum.EDIT_DENIED]: Flag,
    [NotificationTypeEnum.EDIT_UPDATED]: RefreshCw,
    [NotificationTypeEnum.COMMENT_REPLY]: MessageSquarePlus,
    [NotificationTypeEnum.COMMENT_VOTE]: Heart,
    [NotificationTypeEnum.ARTICLE_VOTE]: Heart,
    [NotificationTypeEnum.COMMENT_TAG]: AtSign,
    [NotificationTypeEnum.EDIT_COMMENT]: MessageSquarePlus,
    [NotificationTypeEnum.COLLECTION_COMMENT]: MessageSquarePlus,
    [NotificationTypeEnum.HIKKA_UPDATE]: Info,
    [NotificationTypeEnum.SCHEDULE_ANIME]: Tv,
    [NotificationTypeEnum.FOLLOW]: UserPlus,
    [NotificationTypeEnum.COLLECTION_VOTE]: Heart,
    [NotificationTypeEnum.THIRDPARTY_LOGIN]: LockKeyholeOpen,
    [NotificationTypeEnum.ARTICLE_COMMENT]: MessageSquarePlus,
};

export const notificationIcon = ({
    type,
    scoreSign,
}: NotificationItem): LucideIcon => {
    if (scoreSign) return scoreSign > 0 ? HeartPlus : HeartMinus;

    return TYPE_ICONS[type];
};

// Uniwind compiles literal class names only, so the accents are a map of full classes.
export const ACCENT_BADGE_CLASSES: Record<NotificationAccent, string> = {
    primary: 'border-primary-border bg-primary',
    success: 'border-success-border bg-success',
    warning: 'border-warning-border bg-warning',
    destructive: 'border-destructive-border bg-destructive',
    info: 'border-info-border bg-info',
    neutral: 'border-border bg-muted',
};

export const ACCENT_ICON_CLASSES: Record<NotificationAccent, string> = {
    primary: 'text-primary-foreground',
    success: 'text-success-foreground',
    warning: 'text-warning-foreground',
    destructive: 'text-destructive-foreground',
    info: 'text-info-foreground',
    neutral: 'text-muted-foreground',
};
