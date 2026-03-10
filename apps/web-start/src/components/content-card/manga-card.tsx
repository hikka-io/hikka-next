import {
    ContentTypeEnum,
    MangaInfoResponse,
    MangaResponse,
} from '@hikka/client';
import { FC } from 'react';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

interface Props extends ContentCardProps {
    manga: MangaResponse | MangaInfoResponse;
}

const MangaCard: FC<Props> = ({ manga, ...props }) => {
    return (
        <ContentCard
            {...getMediaCardProps(
                manga,
                {
                    contentType: ContentTypeEnum.MANGA,
                    basePath: '/manga',
                    mediaTypeMap: MANGA_MEDIA_TYPE,
                },
                { read: manga.read ? manga.read[0] : undefined },
            )}
            {...props}
        />
    );
};

export default MangaCard;
