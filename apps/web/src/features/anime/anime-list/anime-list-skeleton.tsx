import { range } from '@antfu/utils';

import SkeletonCard from '../../../components/skeletons/content-card-skeleton';

const AnimeListSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
            {range(1, 20).map((v) => (
                <SkeletonCard key={v} />
            ))}
        </div>
    );
};

export default AnimeListSkeleton;
