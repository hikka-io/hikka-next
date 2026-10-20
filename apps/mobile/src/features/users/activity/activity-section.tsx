import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { View } from 'react-native';

import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';

import { serviceUserActivityOptions } from '../queries';
import ActivityHeatmap from './activity-heatmap';
import ActivityStats from './activity-stats';

type Props = {
    username: string;
};

/** The web's "Активність": a year of actions as a heatmap, then the comment, review and edit counts. */
const ActivitySection: FC<Props> = ({ username }) => {
    const { data, error, refetch } = useQuery({
        ...serviceUserActivityOptions({ path: { username } }),
        subscribed: useIsFocused(),
    });

    return (
        <View className="px-4 pt-6">
            <Card className="gap-3">
                <Header>
                    <HeaderTitle>Активність</HeaderTitle>
                </Header>
                {error ? (
                    <ErrorState
                        variant="inline"
                        title="Не вдалося завантажити активність"
                        onRetry={() => void refetch()}
                    />
                ) : data ? (
                    <ActivityHeatmap activity={data} />
                ) : (
                    <HeatmapSkeleton />
                )}
                <ActivityStats username={username} />
            </Card>
        </View>
    );
};

const HeatmapSkeleton: FC = () => (
    <View className="gap-3">
        <Skeleton className="h-[98px] w-full rounded-sm" />
        <Skeleton className="h-4 w-1/2 rounded-sm" />
    </View>
);

export default ActivitySection;
