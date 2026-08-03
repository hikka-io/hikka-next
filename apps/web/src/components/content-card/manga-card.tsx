import type { FC } from 'react';

import { ContentTypeEnum, type ReadResponseBase } from '@hikka/api';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import EntityCard, { type EntityCardProps } from './entity-card';
import type { MediaTooltipItemOf } from './tooltips';

type Props = Omit<EntityCardProps, 'entity'> & {
    item: MediaTooltipItemOf<'manga'>;
    read?: ReadResponseBase | null;
};

const MangaCard: FC<Props> = ({ item, read, ...props }) => (
    <EntityCard
        entity={{ type: ContentTypeEnum.MANGA, data: item, read }}
        withContextMenu
        leftSubtitle={item.year ? String(item.year) : undefined}
        rightSubtitle={
            item.media_type
                ? MANGA_MEDIA_TYPE[
                      item.media_type as keyof typeof MANGA_MEDIA_TYPE
                  ]?.title_ua
                : undefined
        }
        {...props}
    />
);

export default MangaCard;
