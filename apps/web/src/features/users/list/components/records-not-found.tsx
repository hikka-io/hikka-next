import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadStatusEnum,
    type WatchStatusEnum,
} from '@hikka/api';

import MaterialSymbolsBookmarkOutline from '@/components/icons/material-symbols/MaterialSymbolsBookmarkOutline';
import EmptyState from '@/components/ui/empty-state';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

type Props = {
    status: ReadStatusEnum | WatchStatusEnum | 'all';
    content_type: MainContentTypeEnum;
};

const CONTENT_TYPE_TITLE = {
    [ContentTypeEnum.MANGA]: 'манґу',
    [ContentTypeEnum.NOVEL]: 'ранобе',
    [ContentTypeEnum.ANIME]: 'аніме',
};

const RecordsNotFound = ({ status, content_type }: Props) => {
    const statusTitle =
        status === 'all'
            ? undefined
            : content_type === ContentTypeEnum.ANIME
              ? WATCH_STATUS[status as WatchStatusEnum].title_ua
              : READ_STATUS[status as ReadStatusEnum].title_ua;

    return (
        <EmptyState
            icon={<MaterialSymbolsBookmarkOutline />}
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
            description={`Цей список оновиться після того, як сюди буде додано ${CONTENT_TYPE_TITLE[content_type]}${statusTitle ? ' з цим статусом' : ''}`}
        />
    );
};

export default RecordsNotFound;
