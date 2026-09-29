import { isToday, isYesterday } from 'date-fns';

import type { Notification } from '../types';

export interface GroupedNotifications {
    today: Notification[];
    yesterday: Notification[];
    earlier: Notification[];
}

export const groupNotificationsByDay = (
    items: Notification[],
): GroupedNotifications => {
    const result: GroupedNotifications = {
        today: [],
        yesterday: [],
        earlier: [],
    };
    for (const item of items) {
        const ms = item.created * 1000;
        if (isToday(ms)) result.today.push(item);
        else if (isYesterday(ms)) result.yesterday.push(item);
        else result.earlier.push(item);
    }
    return result;
};
