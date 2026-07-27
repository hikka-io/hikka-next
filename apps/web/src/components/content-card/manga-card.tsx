import type { FC } from 'react';

import {
    ContentTypeEnum,
    type MangaResponse,
    type MangaResponseWithRead,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps, getTooltipItem } from './utils';

type Props = ContentCardProps & {
    item: MangaResponseWithRead | MangaResponse;
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
                { read: 'read' in item ? (item.read[0] ?? null) : undefined },
            )}
            tooltipItem={getTooltipItem(item, 'manga')}
            title={title}
            {...props}
        />
    );
};

export default MangaCard;
