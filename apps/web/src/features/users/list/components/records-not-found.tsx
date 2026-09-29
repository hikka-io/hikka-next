import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadStatusEnum,
    type WatchStatusEnum,
} from '@hikka/api';

import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import MaterialSymbolsBookmarkOutline from '@/components/icons/material-symbols/MaterialSymbolsBookmarkOutline';
import EmptyState from '@/components/ui/empty-state';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';
import { CONTENT_TYPES } from '@/utils/labels';

type Props = {
    status: ReadStatusEnum | WatchStatusEnum | 'all';
    content_type: MainContentTypeEnum;
};

const RecordsNotFound = ({ status, content_type }: Props) => {
    const statusProperty =
        status === 'all'
            ? undefined
            : content_type === ContentTypeEnum.ANIME
              ? WATCH_STATUS[status as WatchStatusEnum]
              : READ_STATUS[status as ReadStatusEnum];

    const statusIcon =
        status === 'all'
            ? undefined
            : content_type === ContentTypeEnum.ANIME
              ? WATCH_STATUS_ICONS[status as WatchStatusEnum]
              : READ_STATUS_ICONS[status as ReadStatusEnum];

    const statusTitle = statusProperty?.title_ua;
    const StatusIcon = statusIcon ?? MaterialSymbolsBookmarkOutline;

    return (
        <EmptyState
            bordered
            icon={<StatusIcon />}
            title={
                statusTitle ? (
                    <span>
                        У списку{' '}
                        <span className="font-black">{statusTitle}</span> пусто
                    </span>
                ) : (
                    <span>Список пустий</span>
                )
            }
            description={`Цей список оновиться після того, як сюди буде додано ${CONTENT_TYPES[content_type].accusative}${statusTitle ? ' з цим статусом' : ''}`}
        />
    );
};

export default RecordsNotFound;
