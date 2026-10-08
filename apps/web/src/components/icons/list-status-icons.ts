import type { ComponentType } from 'react';

import { ReadStatusEnum, WatchStatusEnum } from '@hikka/api';

import StatusCompleted from '@/components/icons/list-status/StatusCompleted';
import StatusDropped from '@/components/icons/list-status/StatusDropped';
import StatusOnHold from '@/components/icons/list-status/StatusOnHold';
import StatusPlanned from '@/components/icons/list-status/StatusPlanned';
import StatusWatching from '@/components/icons/list-status/StatusWatching';
import MaterialSymbolsBookmarkFlagOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsBookmarkFlagOutlineRounded';
import MaterialSymbolsBookmarkOutline from '@/components/icons/material-symbols/MaterialSymbolsBookmarkOutline';

type StatusIcon = ComponentType<{ className?: string }>;

export const WATCH_STATUS_ICONS = {
    [WatchStatusEnum.PLANNED]: StatusPlanned,
    [WatchStatusEnum.WATCHING]: StatusWatching,
    [WatchStatusEnum.COMPLETED]: StatusCompleted,
    [WatchStatusEnum.ON_HOLD]: StatusOnHold,
    [WatchStatusEnum.DROPPED]: StatusDropped,
} as const satisfies Record<WatchStatusEnum, StatusIcon>;

export const READ_STATUS_ICONS = {
    [ReadStatusEnum.PLANNED]: StatusPlanned,
    [ReadStatusEnum.COMPLETED]: StatusCompleted,
    [ReadStatusEnum.ON_HOLD]: MaterialSymbolsBookmarkFlagOutlineRounded,
    [ReadStatusEnum.DROPPED]: StatusDropped,
    [ReadStatusEnum.READING]: MaterialSymbolsBookmarkOutline,
} as const satisfies Record<ReadStatusEnum, StatusIcon>;

export const LIST_STATUS_ICONS = {
    watch: WATCH_STATUS_ICONS,
    read: READ_STATUS_ICONS,
} as const;
