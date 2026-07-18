import type { FC } from 'react';

import { type AnimeResponseWithWatch, ContentTypeEnum } from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    title?: string;
    item: AnimeResponseWithWatch;
};

const AnimeCard: FC<Props> = ({ item, ...props }) => {
    const fallbackTitle = useTitle(item);
    const title = props.title || fallbackTitle;

    return (
        <ContentCard
            {...getMediaCardProps(
                item,
                {
                    contentType: ContentTypeEnum.ANIME,
                    basePath: '/anime',
                    mediaTypeMap: ANIME_MEDIA_TYPE,
                },
                { watch: item.watch ? item.watch[0] : undefined },
            )}
            title={title}
            {...props}
        />
    );
};

export default AnimeCard;
