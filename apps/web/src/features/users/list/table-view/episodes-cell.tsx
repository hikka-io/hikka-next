import type { FC } from 'react';

import { TableCell } from '@/components/ui/table';

type Props = {
    episodes: number;
    total?: number | null;
};

const EpisodesCell: FC<Props> = ({ episodes, total }) => (
    <TableCell className="w-20 text-center max-md:pr-4!" align="center">
        {episodes} / {total || '?'}
    </TableCell>
);

export default EpisodesCell;
