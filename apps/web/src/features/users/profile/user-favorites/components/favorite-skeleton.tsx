import type { FC } from 'react';

import { range } from '@antfu/utils';

import SkeletonCard from '@/components/content-card/poster-card-skeleton';
import Stack from '@/components/ui/stack';

import { DEFAULT_PAGE_SIZE, FAVOURITES_PREVIEW_SIZE } from '../../../queries';

type Props = {
    extended?: boolean;
    total?: number;
};

const FavoriteSkeleton: FC<Props> = ({ extended, total }) => {
    const size = extended ? DEFAULT_PAGE_SIZE : FAVOURITES_PREVIEW_SIZE;
    const count = Math.min(total || size, size);

    return (
        <Stack
            extended={extended}
            size={6}
            extendedSize={7}
            className="grid-min-10"
        >
            {range(0, count).map((index) => (
                <SkeletonCard key={index} />
            ))}
        </Stack>
    );
};

export default FavoriteSkeleton;
