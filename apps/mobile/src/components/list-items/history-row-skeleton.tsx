import type { FC } from 'react';

import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

type Props = {
    showUser?: boolean;
    className?: string;
};

const HistoryRowSkeleton: FC<Props> = ({ showUser = false, className }) => (
    <View className={cn('flex-row items-center gap-4', className)}>
        <Skeleton className="aspect-[0.7] w-12 rounded-lg" />
        <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            {showUser && <Skeleton className="h-3 w-1/3" />}
        </View>
    </View>
);

export default HistoryRowSkeleton;
