import { FC } from 'react';

import { TableCell } from '@/components/ui/table';

interface Props {
    chapters: number;
    total?: number | null;
}

const ChaptersCell: FC<Props> = ({ chapters, total }) => (
    <TableCell className="w-20 text-center" align="center">
        {chapters} / {total || '?'}
    </TableCell>
);

export default ChaptersCell;
