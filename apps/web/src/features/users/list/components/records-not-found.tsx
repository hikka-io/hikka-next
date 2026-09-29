import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadStatusEnum,
    type WatchStatusEnum,
} from '@hikka/api';

import { LIST_STATUS_ICONS } from '@/components/icons/list-status-icons';
import MaterialSymbolsBookmarkOutline from '@/components/icons/material-symbols/MaterialSymbolsBookmarkOutline';
import EmptyState from '@/components/ui/empty-state';
import { CONTENT_TYPES, LIST_STATUS } from '@/utils/labels';

type Props = {
    status: ReadStatusEnum | WatchStatusEnum | 'all';
    content_type: MainContentTypeEnum;
};

const RecordsNotFound = ({ status, content_type }: Props) => {
    const kind = content_type === ContentTypeEnum.ANIME ? 'watch' : 'read';
    const statusKey = status as keyof (typeof LIST_STATUS)[typeof kind];

    const statusProperty =
        status === 'all' ? undefined : LIST_STATUS[kind][statusKey];
    const statusIcon =
        status === 'all' ? undefined : LIST_STATUS_ICONS[kind][statusKey];

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
