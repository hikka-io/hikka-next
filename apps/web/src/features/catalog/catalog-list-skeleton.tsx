import type { FC } from 'react';

import { range } from '@antfu/utils';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Stack, { type StackSize } from '@/components/ui/stack';

type Props = {
    count: number;
    extendedSize?: StackSize;
};

const CatalogListSkeleton: FC<Props> = ({ count, extendedSize = 5 }) => {
    return (
        <Stack extended size={5} extendedSize={extendedSize}>
            {range(0, count).map((v) => (
                <PosterCardSkeleton key={v} />
            ))}
        </Stack>
    );
};

export default CatalogListSkeleton;
