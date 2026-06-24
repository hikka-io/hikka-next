import type { FC } from 'react';

import {
    ContentTypeEnum,
    type MangaInfoResponse,
    type MangaResponse,
} from '@hikka/client';
import { useTitle } from '@hikka/react';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    manga: MangaResponse | MangaInfoResponse;
};

const MangaCard: FC<Props> = ({ manga, ...props }) => {
    const title = useTitle(manga);

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
            title={title}
            {...props}
        />
    );
};

export default MangaCard;
