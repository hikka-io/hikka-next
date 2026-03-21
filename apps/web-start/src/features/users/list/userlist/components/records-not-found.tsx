import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';

import NotFound from '@/components/ui/not-found';

import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

interface Props {
    status: ReadStatusEnum | WatchStatusEnum | 'all';
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

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
        <NotFound
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
            description={`Цей список оновиться після того як сюди буде додано ${CONTENT_TYPE_TITLE[content_type]}${statusTitle ? ' з цим статусом' : ''}`}
        />
    );
};

export default RecordsNotFound;
