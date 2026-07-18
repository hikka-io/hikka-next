import type { FC } from 'react';

import { ContentTypeEnum, type NovelResponseWithRead } from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { NOVEL_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    title?: string;
    item: NovelResponseWithRead;
};

const NovelCard: FC<Props> = ({ item, ...props }) => {
    const fallbackTitle = useTitle(item);
    const title = props.title || fallbackTitle;

    return (
        <ContentCard
            {...getMediaCardProps(
                item,
                {
                    contentType: ContentTypeEnum.NOVEL,
                    basePath: '/novel',
                    mediaTypeMap: NOVEL_MEDIA_TYPE,
                },
                { read: item.read ? item.read[0] : undefined },
            )}
            title={title}
            {...props}
        />
    );
};

export default NovelCard;
