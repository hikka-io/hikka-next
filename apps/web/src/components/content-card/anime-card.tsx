import type { FC } from 'react';

import { ContentTypeEnum, type WatchResponseBase } from '@hikka/api';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

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
        rightSubtitle={
            item.media_type
                ? ANIME_MEDIA_TYPE[
                      item.media_type as keyof typeof ANIME_MEDIA_TYPE
                  ]?.title_ua
                : undefined
        }
        {...props}
    />
);

export default AnimeCard;
