import {
    ContentTypeEnum,
    NovelInfoResponse,
    NovelResponse,
} from '@hikka/client';
import { FC } from 'react';

import { NOVEL_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

interface Props extends ContentCardProps {
    novel: NovelResponse | NovelInfoResponse;
}

const NovelCard: FC<Props> = ({ novel, ...props }) => {
    return (
        <ContentCard
            {...getMediaCardProps(
                novel,
                {
                    contentType: ContentTypeEnum.NOVEL,
                    basePath: '/novel',
                    mediaTypeMap: NOVEL_MEDIA_TYPE,
                },
                { read: novel.read ? novel.read[0] : undefined },
            )}
            {...props}
        />
    );
};

export default NovelCard;
