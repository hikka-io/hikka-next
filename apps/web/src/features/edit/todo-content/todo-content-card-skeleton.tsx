import type { FC } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { FLUSH_SURFACE_CLASS_NAME } from '@/components/ui/surface';
import { cn } from '@/utils/cn';

type Props = {
    media?: boolean;
};

const TodoContentCardSkeleton: FC<Props> = ({ media }) => {
    return (
        <div
            className={cn('flex flex-col gap-4 p-4', FLUSH_SURFACE_CLASS_NAME)}
        >
            <div className="flex gap-4">
                <div className="w-24 shrink-0">
                    <AspectRatio ratio={0.7}>
                        <Skeleton className="size-full rounded-(--base-radius)" />
                    </AspectRatio>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div
                        className={cn(
                            'flex items-center',
                            media ? 'h-8' : 'h-4.5',
                        )}
                    >
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    {media && (
                        <div className="flex h-6 items-center">
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    )}
                    <div className="flex gap-1.5">
                        <Skeleton className="h-5.5 w-20 rounded-sm" />
                        <Skeleton className="h-5.5 w-16 rounded-sm" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
};

export default TodoContentCardSkeleton;
