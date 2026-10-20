import type { ReactNode } from 'react';

import type { NotificationItem } from '@hikka/core';

export type Notification = NotificationItem & {
    typeIcon: ReactNode;
};
