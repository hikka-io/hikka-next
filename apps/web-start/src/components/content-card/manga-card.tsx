import type { FC } from 'react';

import { ContentTypeEnum, type MangaResponseWithRead } from '@hikka/api';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';
import { useTitle } from '@/utils/title/use-title';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    manga: MangaResponseWithRead;
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
