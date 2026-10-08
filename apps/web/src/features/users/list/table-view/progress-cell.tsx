import type { FC } from 'react';

import { TableCell } from '@/components/ui/table';
import { cn } from '@/utils/cn';

type Props = {
    value: number;
    total?: number | null;
    className?: string;
};

const ProgressCell: FC<Props> = ({ value, total, className }) => (
    <TableCell className={cn('w-20 text-center', className)} align="center">
        {value} / {total || '?'}
    </TableCell>
);

export default ProgressCell;
