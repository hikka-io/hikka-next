import type { ReactNode } from 'react';

import type { NotificationTypeEnum } from '@hikka/api';

export type NotificationActor = {
    username?: string;
    avatar?: string;
    href?: string;
};

export type NotificationAccent =
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'neutral';

export type Notification = {
    reference: string;
    type: NotificationTypeEnum;
    created: number;
    seen: boolean;

    title: string;
    description: string;
    href: string;
    typeIcon: ReactNode;
    accent: NotificationAccent;

    actor?: NotificationActor;
    preview?: string;
    scoreSign?: 1 | -1;
    contentImage?: string;
};
