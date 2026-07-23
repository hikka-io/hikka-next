import type { FC } from 'react';

import { range } from '@antfu/utils';

import SkeletonCard from '@/components/content-card/content-card-skeleton';
import Stack from '@/components/ui/stack';

type Props = {
    extended?: boolean;
};

const FavoriteSkeleton: FC<Props> = ({ extended }) => {
    return (
        <Stack
            extended={extended}
            size={6}
            extendedSize={7}
            className="grid-min-10"
        >
            {range(1, extended ? 15 : 7).map((v) => (
                <SkeletonCard key={v} />
            ))}
        </Stack>
    );
};

export default FavoriteSkeleton;
