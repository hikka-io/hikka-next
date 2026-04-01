import { FC } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    hasTitle?: boolean;
}

const ContentCardSkeleton: FC<Props> = ({ hasTitle = true }) => {
    return (
        <div className="flex flex-col gap-2">
            <AspectRatio ratio={0.7}>
                <Skeleton className="size-full rounded-md" />
            </AspectRatio>
            {hasTitle && (
                <div className="flex flex-col gap-2 py-3">
                    <Skeleton className="h-2 w-full rounded-lg" />
                    <Skeleton className="h-2 w-1/3 rounded-lg" />
                </div>
            )}
        </div>
    );
};

export default ContentCardSkeleton;
