import { FC } from 'react';

import { TableCell } from '@/components/ui/table';

interface Props {
    episodes: number;
    total?: number | null;
}

const EpisodesCell: FC<Props> = ({ episodes, total }) => (
    <TableCell className="w-20 text-center" align="center">
        {episodes} / {total || '?'}
    </TableCell>
);

export default EpisodesCell;
