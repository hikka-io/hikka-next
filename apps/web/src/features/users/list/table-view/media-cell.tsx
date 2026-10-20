import type { FC } from 'react';

import type { AnimeMediaEnum } from '@hikka/api';
import { ANIME_MEDIA_TYPE } from '@hikka/core';

import { TableCell } from '@/components/ui/table';

type Props = {
    media_type?: AnimeMediaEnum | null;
};

const MediaCell: FC<Props> = ({ media_type }) => (
    <TableCell className="hidden w-20 lg:table-cell" align="center">
        {media_type ? ANIME_MEDIA_TYPE[media_type].title_ua : '-'}
    </TableCell>
);

export default MediaCell;
