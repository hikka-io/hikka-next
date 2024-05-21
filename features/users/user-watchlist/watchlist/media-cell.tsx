import { FC } from 'react';

import { TableCell } from '@/components/ui/table';

import { MEDIA_TYPE } from '@/utils/constants';

interface Props {
    media_type: API.MediaType;
}

const MediaCell: FC<Props> = ({ media_type }) => (
    <TableCell className="hidden w-20 lg:table-cell" align="center">
        {MEDIA_TYPE[media_type as API.MediaType]?.title_ua || '-'}
    </TableCell>
);

export default MediaCell;
