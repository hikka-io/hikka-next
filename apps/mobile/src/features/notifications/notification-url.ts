import { NO_NOTIFICATION_HREF } from '@hikka/core';

import { siteUrl } from '@/utils/site-origin';

const MAX_BADGE_COUNT = 99;

/** The link a notification opens, or `null` when it has none. Site paths become hikka.io URLs for the shared link table. */
export const notificationUrl = (href: string): string | null => {
    if (href === NO_NOTIFICATION_HREF) return null;

    return href.startsWith('/') ? siteUrl(href) : href;
};

export const badgeText = (count: number) =>
    count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);
