import { FC } from 'react';

import { TableCell } from '@/components/ui/table';

interface Props {
    volumes: number;
    total: number;
}

const VolumesCell: FC<Props> = ({ volumes, total }) => (
    <TableCell className="w-20 text-center" align="center">
        {volumes} / {total || '?'}
    </TableCell>
);

export default VolumesCell;
