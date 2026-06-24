import type { FC } from 'react';

import { range } from '@antfu/utils';

import SkeletonCard from '@/components/content-card/content-card-skeleton';
import Stack, { type StackSize } from '@/components/ui/stack';

interface Props {
    extendedSize?: StackSize;
}

const CatalogListSkeleton: FC<Props> = ({ extendedSize = 5 }) => {
    return (
        <Stack extended size={5} extendedSize={extendedSize}>
            {range(1, 20).map((v) => (
                <SkeletonCard key={v} />
            ))}
        </Stack>
    );
};

export default CatalogListSkeleton;
