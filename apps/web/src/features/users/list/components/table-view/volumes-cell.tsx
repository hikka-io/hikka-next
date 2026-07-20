import type { FC } from 'react';

import { TableCell } from '@/components/ui/table';

type Props = {
    volumes: number;
    total?: number | null;
};

const VolumesCell: FC<Props> = ({ volumes, total }) => (
    <TableCell className="w-20 text-center max-md:pr-4!" align="center">
        {volumes} / {total || '?'}
    </TableCell>
);

export default VolumesCell;
