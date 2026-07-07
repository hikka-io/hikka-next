import type { FC } from 'react';

import { range } from '@antfu/utils';

import SkeletonCard from '@/components/content-card/content-card-skeleton';
import { cn } from '@/utils/cn';

type Props = {
    extended?: boolean;
};

const FavoriteSkeleton: FC<Props> = ({ extended }) => {
    return (
        <div
            className={cn(
                'grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8',
                !extended &&
                    'grid-min-10 no-scrollbar -mx-4 auto-cols-scroll grid-flow-col grid-cols-scroll overflow-x-auto px-4',
            )}
        >
            {range(1, extended ? 13 : 7).map((v) => (
                <SkeletonCard key={v} />
            ))}
        </div>
    );
};

export default FavoriteSkeleton;
