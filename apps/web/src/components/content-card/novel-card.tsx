import type { FC } from 'react';

import {
    ContentTypeEnum,
    type NovelCatalogResponse,
    type NovelResponseWithRead,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { NOVEL_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    item: NovelResponseWithRead | NovelCatalogResponse;
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
                { read: item.read ? (item.read[0] ?? null) : undefined },
            )}
            tooltipItem={'genres' in item && 'read' in item ? item : undefined}
            title={title}
            {...props}
        />
    );
};

export default NovelCard;
