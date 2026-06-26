import type { FC } from 'react';

import { ContentTypeEnum, type NovelResponseWithRead } from '@hikka/api';
import { useTitle } from '@hikka/react';

import { NOVEL_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    novel: NovelResponseWithRead;
};

const NovelCard: FC<Props> = ({ novel, ...props }) => {
    const title = useTitle(novel);

    return (
        <ContentCard
            {...getMediaCardProps(
                novel,
                {
                    contentType: ContentTypeEnum.NOVEL,
                    basePath: '/novel',
                    mediaTypeMap: NOVEL_MEDIA_TYPE,
                },
                { read: novel.read ? novel.read[0] : undefined },
            )}
            title={title}
            {...props}
        />
    );
};

export default NovelCard;
