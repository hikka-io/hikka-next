import clsx from 'clsx';
import { CSSProperties } from 'react';

import { TableCell } from '@/components/ui/table';

interface Props {
    score: number;
}

const Component = ({ score }: Props) => (
    <TableCell className="w-20" align="center">
        <div
            className={clsx(
                'radial-progress border border-secondary text-primary',
            )}
            style={
                {
                    '--value': score * 10,
                    '--size': '2.5rem',
                    '--thickness': score > 0 ? '2px' : '0px',
                } as CSSProperties
            }
            role="progressbar"
        >
            {score}
        </div>
    </TableCell>
);

export default Component;
