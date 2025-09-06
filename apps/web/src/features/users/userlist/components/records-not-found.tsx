import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';

import NotFound from '@/components/ui/not-found';

import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

interface Props {
    status: ReadStatusEnum | WatchStatusEnum;
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
        content_type === ContentTypeEnum.ANIME
            ? WATCH_STATUS[status as WatchStatusEnum].title_ua
            : READ_STATUS[status as ReadStatusEnum].title_ua;

    return (
        <NotFound
            title={
                <span>
                    У списку <span className="font-black">{statusTitle}</span>{' '}
                    пусто
                </span>
            }
            description={`Цей список оновиться після того як сюди буде додано ${CONTENT_TYPE_TITLE[content_type]} з цим статусом`}
        />
    );
};

export default RecordsNotFound;
