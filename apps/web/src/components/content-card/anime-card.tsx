import type { FC } from 'react';

import { ContentTypeEnum, type WatchResponseBase } from '@hikka/api';

import { getMediaTypeLabel } from '@/utils/labels';

import EntityCard, { type EntityCardProps } from './entity-card';
import type { MediaTooltipItemOf } from './tooltips';

type Props = Omit<EntityCardProps, 'entity'> & {
    item: MediaTooltipItemOf<'anime'>;
    watch?: WatchResponseBase | null;
};

const AnimeCard: FC<Props> = ({ item, watch, ...props }) => (
    <EntityCard
        entity={{ type: ContentTypeEnum.ANIME, data: item, watch }}
        withContextMenu
        leftSubtitle={item.year ? String(item.year) : undefined}
        rightSubtitle={getMediaTypeLabel(item.media_type)}
        {...props}
    />
);

export default AnimeCard;
