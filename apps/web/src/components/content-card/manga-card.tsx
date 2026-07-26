import type { FC } from 'react';

import {
    ContentTypeEnum,
    type MangaCatalogResponse,
    type MangaResponseWithRead,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    item: MangaResponseWithRead | MangaCatalogResponse;
};

const MangaCard: FC<Props> = ({ item, ...props }) => {
    const title = useTitle(item);

    return (
        <ContentCard
            {...getMediaCardProps(
                item,
                {
                    contentType: ContentTypeEnum.MANGA,
                    basePath: '/manga',
                    mediaTypeMap: MANGA_MEDIA_TYPE,
                },
                { read: item.read ? (item.read[0] ?? null) : undefined },
            )}
            tooltipItem={'genres' in item && 'read' in item ? item : undefined}
            title={title}
            {...props}
        />
    );
};

export default MangaCard;
