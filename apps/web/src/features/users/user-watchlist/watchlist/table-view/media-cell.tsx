import { AnimeMediaEnum } from '@hikka/client';
import { FC } from 'react';

import { TableCell } from '@/components/ui/table';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

interface Props {
    media_type?: AnimeMediaEnum;
}

const MediaCell: FC<Props> = ({ media_type }) => (
    <TableCell className="hidden w-20 lg:table-cell" align="center">
        {media_type ? ANIME_MEDIA_TYPE[media_type].title_ua : '-'}
    </TableCell>
);

export default MediaCell;
