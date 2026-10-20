import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { MessageCircle, Pencil, Star } from 'lucide-react-native';
import { View } from 'react-native';

import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import { serviceUserStatsOptions } from '../queries';

type Props = {
    username: string;
};

type StatProps = {
    label: string;
    count: number;
    icon: typeof Star;
};

const Stat: FC<StatProps> = ({ label, count, icon }) => (
    <View
        accessible
        accessibilityLabel={`${label}: ${count}`}
        className={cn('flex-1 items-center gap-1', count === 0 && 'opacity-50')}
    >
        <Text
            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
            className="font-semibold text-base tabular-nums"
        >
            {count}
        </Text>
        <View className="flex-row items-center gap-1">
            <Icon as={icon} className="size-3 text-muted-foreground" />
            <Text
                numberOfLines={1}
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className="text-muted-foreground text-xs"
            >
                {label}
            </Text>
        </View>
    </View>
);

/** The web's comments, reviews and edits counts under the heatmap. */
const ActivityStats: FC<Props> = ({ username }) => {
    const { data, error, refetch } = useQuery({
        ...serviceUserStatsOptions({ path: { username } }),
        subscribed: useIsFocused(),
    });

    if (error) {
        return <ErrorState variant="inline" onRetry={() => void refetch()} />;
    }

    return (
        <View className="flex-row gap-3 border-border border-t pt-3">
            {data ? (
                <>
                    <Stat
                        label="Коментарі"
                        count={
                            (data.comments_count ?? 0) -
                            (data.reviews_count ?? 0)
                        }
                        icon={MessageCircle}
                    />
                    <Stat
                        label="Відгуки"
                        count={data.reviews_count ?? 0}
                        icon={Star}
                    />
                    <Stat
                        label="Правки"
                        count={data.edits_count ?? 0}
                        icon={Pencil}
                    />
                </>
            ) : (
                Array.from({ length: 3 }, (_, index) => (
                    <View
                        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                        key={index}
                        className="flex-1 items-center gap-1"
                    >
                        <Skeleton className="h-6 w-8 rounded-sm" />
                        <Skeleton className="h-4 w-16 rounded-sm" />
                    </View>
                ))
            )}
        </View>
    );
};

export default ActivityStats;
