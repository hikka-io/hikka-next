import { FC } from 'react';

import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';

interface Props {
    score: number;
}

const ScoreCell: FC<Props> = ({ score }) => (
    <TableCell className="w-4 text-center" align="right">
        {!!score && (
            <Badge variant="outline">
                {score}
                <MaterialSymbolsStarRounded className="text-yellow-400" />
            </Badge>
        )}
    </TableCell>
);

export default ScoreCell;
