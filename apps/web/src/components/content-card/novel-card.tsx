import type { FC } from 'react';

import {
    ContentTypeEnum,
    type NovelResponse,
    type NovelResponseWithRead,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { NOVEL_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps, getTooltipItem } from './utils';

type Props = ContentCardProps & {
    item: NovelResponseWithRead | NovelResponse;
};

const NovelCard: FC<Props> = ({ item, ...props }) => {
    const title = useTitle(item);

    return (
        <ContentCard
            {...getMediaCardProps(
                item,
                {
                    contentType: ContentTypeEnum.NOVEL,
                    basePath: '/novel',
                    mediaTypeMap: NOVEL_MEDIA_TYPE,
                },
                { read: 'read' in item ? (item.read[0] ?? null) : undefined },
            )}
            tooltipItem={getTooltipItem(item, 'novel')}
            title={title}
            {...props}
        />
    );
};

export default NovelCard;
