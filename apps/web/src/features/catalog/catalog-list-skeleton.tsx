import type { FC } from 'react';

import { range } from '@antfu/utils';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Stack, { type StackSize } from '@/components/ui/stack';

type Props = {
    extendedSize?: StackSize;
};

const CatalogListSkeleton: FC<Props> = ({ extendedSize = 5 }) => {
    return (
        <Stack extended size={5} extendedSize={extendedSize}>
            {range(1, 20).map((v) => (
                <PosterCardSkeleton key={v} />
            ))}
        </Stack>
    );
};

export default CatalogListSkeleton;
