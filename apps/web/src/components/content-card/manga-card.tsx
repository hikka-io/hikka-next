import type { FC } from 'react';

import { ContentTypeEnum, type ReadResponseBase } from '@hikka/api';

import { getMediaTypeLabel } from '@/utils/labels';

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
        rightSubtitle={getMediaTypeLabel(item.media_type)}
        {...props}
    />
);

export default MangaCard;
