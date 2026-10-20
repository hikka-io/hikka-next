import { ContentTypeEnum } from '@hikka/api';
import {
    LIST_STATUS,
    READ_STATUS_ORDER,
    WATCH_STATUS_ORDER,
} from '@hikka/core';

import type { STATUS_DOT } from '@/components/tracking';

import type { ListContentType, UserListStats } from './queries';

export type ListStatus = keyof typeof STATUS_DOT;

export type StatusCounts = Partial<Record<ListStatus, number>> & {
    duration?: number;
};

export const statusOrder = (
    contentType: ListContentType,
): readonly ListStatus[] =>
    contentType === ContentTypeEnum.ANIME
        ? WATCH_STATUS_ORDER
        : READ_STATUS_ORDER;

export const statusLabel = (contentType: ListContentType, status: string) => {
    const labels = (
        contentType === ContentTypeEnum.ANIME
            ? LIST_STATUS.watch
            : LIST_STATUS.read
    ) as Record<string, { title_ua: string } | undefined>;

    return labels[status]?.title_ua;
};

export const countsOf = (stats: UserListStats) => stats as StatusCounts;

export const totalCount = (
    contentType: ListContentType,
    counts: StatusCounts,
) =>
    statusOrder(contentType).reduce(
        (sum, status) => sum + (counts[status] ?? 0),
        0,
    );
