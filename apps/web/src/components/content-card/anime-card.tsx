import type { FC } from 'react';

import {
    type AnimeResponse,
    type AnimeResponseWithWatch,
    ContentTypeEnum,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps, getTooltipItem } from './utils';

type Props = ContentCardProps & {
    item: AnimeResponseWithWatch | AnimeResponse;
};

const AnimeCard: FC<Props> = ({ item, ...props }) => {
    const title = useTitle(item);

    return (
        <ContentCard
            {...getMediaCardProps(
                item,
                {
                    contentType: ContentTypeEnum.ANIME,
                    basePath: '/anime',
                    mediaTypeMap: ANIME_MEDIA_TYPE,
                },
                {
                    watch:
                        'watch' in item ? (item.watch[0] ?? null) : undefined,
                },
            )}
            tooltipItem={getTooltipItem(item, 'anime')}
            title={title}
            {...props}
        />
    );
};

export default AnimeCard;
