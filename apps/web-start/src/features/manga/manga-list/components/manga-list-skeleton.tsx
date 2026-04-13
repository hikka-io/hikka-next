import { range } from '@antfu/utils';
import { FC } from 'react';

import SkeletonCard from '@/components/content-card/content-card-skeleton';
import Stack, { StackSize } from '@/components/ui/stack';

interface Props {
    extendedSize?: StackSize;
}

const MangaListSkeleton: FC<Props> = ({ extendedSize = 5 }) => {
    return (
        <Stack extended size={5} extendedSize={extendedSize}>
            {range(1, 20).map((v) => (
                <SkeletonCard key={v} />
            ))}
        </Stack>
    );
};

export default MangaListSkeleton;
