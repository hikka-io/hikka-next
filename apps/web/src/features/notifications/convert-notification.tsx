import type { ReactNode } from 'react';

import { type NotificationResponse, NotificationTypeEnum } from '@hikka/api';
import {
    convertNotification as convertNotificationItem,
    type NotificationItem,
} from '@hikka/core';

import FeMention from '@/components/icons/fe/FeMention';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsChangeCircleRounded from '@/components/icons/material-symbols/MaterialSymbolsChangeCircleRounded';
import MaterialSymbolsCheckCircleRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckCircleRounded';
import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import MaterialSymbolsFlagCircleRounded from '@/components/icons/material-symbols/MaterialSymbolsFlagCircleRounded';
import MaterialSymbolsHeartMinusRounded from '@/components/icons/material-symbols/MaterialSymbolsHeartMinusRounded';
import MaterialSymbolsHeartPlusRounded from '@/components/icons/material-symbols/MaterialSymbolsHeartPlusRounded';
import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import MaterialSymbolsLiveTvRounded from '@/components/icons/material-symbols/MaterialSymbolsLiveTvRounded';
import MaterialSymbolsLockOpenRightOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRightOutlineRounded';
import MaterialSymbolsPersonAddRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddRounded';

import type { Notification } from './types';

const NOTIFICATION_ICONS: Record<NotificationTypeEnum, ReactNode> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: <MaterialSymbolsCheckCircleRounded />,
    [NotificationTypeEnum.EDIT_DENIED]: <MaterialSymbolsFlagCircleRounded />,
    [NotificationTypeEnum.EDIT_UPDATED]: <MaterialSymbolsChangeCircleRounded />,
    [NotificationTypeEnum.COMMENT_REPLY]: <MaterialSymbolsAddCommentRounded />,
    [NotificationTypeEnum.COMMENT_VOTE]: <MaterialSymbolsFavoriteRounded />,
    [NotificationTypeEnum.COMMENT_TAG]: <FeMention />,
    [NotificationTypeEnum.EDIT_COMMENT]: <MaterialSymbolsAddCommentRounded />,
    [NotificationTypeEnum.COLLECTION_COMMENT]: (
        <MaterialSymbolsAddCommentRounded />
    ),
    [NotificationTypeEnum.HIKKA_UPDATE]: <MaterialSymbolsInfoRounded />,
    [NotificationTypeEnum.SCHEDULE_ANIME]: <MaterialSymbolsLiveTvRounded />,
    [NotificationTypeEnum.FOLLOW]: <MaterialSymbolsPersonAddRounded />,
    [NotificationTypeEnum.COLLECTION_VOTE]: <MaterialSymbolsFavoriteRounded />,
    [NotificationTypeEnum.THIRDPARTY_LOGIN]: (
        <MaterialSymbolsLockOpenRightOutlineRounded />
    ),
    [NotificationTypeEnum.ARTICLE_COMMENT]: (
        <MaterialSymbolsAddCommentRounded />
    ),
    [NotificationTypeEnum.ARTICLE_VOTE]: <MaterialSymbolsFavoriteRounded />,
};

const getTypeIcon = ({ type, scoreSign }: NotificationItem): ReactNode => {
    if (scoreSign) {
        return scoreSign > 0 ? (
            <MaterialSymbolsHeartPlusRounded />
        ) : (
            <MaterialSymbolsHeartMinusRounded />
        );
    }

    return NOTIFICATION_ICONS[type];
};

export const convertNotification = (
    response: NotificationResponse,
): Notification | null => {
    const item = convertNotificationItem(response);

    return item && { ...item, typeIcon: getTypeIcon(item) };
};
