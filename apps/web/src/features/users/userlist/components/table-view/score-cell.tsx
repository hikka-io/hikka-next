import { CSSProperties, FC } from 'react';

import { TableCell } from '@/components/ui/table';

import { cn } from '@/utils/cn';

interface Props {
    score: number;
}

const ScoreCell: FC<Props> = ({ score }) => (
    <TableCell className="w-4 text-right" align="right">
        <div
            className={cn(
                'radial-progress border border-border text-primary-foreground',
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

export default ScoreCell;
