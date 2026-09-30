import type { FC } from 'react';

import { range } from '@antfu/utils';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import Stack, { type StackSize } from '@/components/ui/stack';
import type { View } from '@/utils/cookies';

type Props = {
    view: View;
    extendedSize?: StackSize;
};

const UserListSkeleton: FC<Props> = ({ view, extendedSize = 5 }) => {
    if (view === 'table') {
        return (
            <div className="flex flex-col gap-2">
                {range(0, 10).map((index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <Stack size={5} extendedSize={extendedSize} extended>
            {range(0, 15).map((index) => (
                <PosterCardSkeleton key={index} />
            ))}
        </Stack>
    );
};

export default UserListSkeleton;
