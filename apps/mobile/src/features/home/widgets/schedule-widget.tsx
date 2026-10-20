import { type FC, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { CalendarClock } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import {
    APP_LOCALE_TAG,
    formatHistoryTime,
    isSameHistoryDay,
} from '@hikka/core';

import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import { flattenPages } from '../flatten-pages';
import { homeScheduleOptions } from '../queries';
import ToggleChip from '../toggle-chip';
import WidgetSection from '../widget-section';

const AIRING_WINDOW_MS = 30 * 60 * 1000;
const PREVIEW_SIZE = 6;

type Props = {
    signedIn: boolean;
};

const ScheduleWidget: FC<Props> = ({ signedIn }) => {
    const [onlyWatch, setOnlyWatch] = useState(false);
    const getTitle = useTitle();
    const { data, isPending, isError, refetch } = useInfiniteQuery(
        homeScheduleOptions(onlyWatch),
    );

    const now = Date.now();
    const todayAll = flattenPages(data)?.filter((item) =>
        isSameHistoryDay(item.airing_at, now / 1000),
    );
    const today = todayAll?.slice(0, PREVIEW_SIZE);
    const hiddenCount = (todayAll?.length ?? 0) - PREVIEW_SIZE;
    const todayLabel = new Intl.DateTimeFormat(APP_LOCALE_TAG, {
        day: 'numeric',
        month: 'long',
    }).format(now);

    return (
        <WidgetSection
            title="Календар"
            href="/schedule"
            actions={
                signedIn && (
                    <ToggleChip
                        selected={onlyWatch}
                        onPress={() => setOnlyWatch(!onlyWatch)}
                    >
                        У списку
                    </ToggleChip>
                )
            }
        >
            {isError ? (
                <ErrorState variant="section" onRetry={refetch} />
            ) : (
                <Card className="gap-0 overflow-hidden p-0">
                    <View className="flex-row items-baseline gap-1.5 px-4 pt-3 pb-2">
                        <Text className="font-medium text-muted-foreground text-xs">
                            Сьогодні
                        </Text>
                        <Text className="text-muted-foreground/60 text-xs">
                            {todayLabel}
                        </Text>
                    </View>
                    {isPending &&
                        Array.from({ length: PREVIEW_SIZE }, (_, index) => (
                            <View
                                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                                key={index}
                                className="min-h-11 flex-row items-center gap-3 px-4"
                            >
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-4 flex-1" />
                            </View>
                        ))}
                    {today?.map((item, index) => {
                        const airingAt = item.airing_at * 1000;
                        const airingNow =
                            airingAt <= now &&
                            airingAt + AIRING_WINDOW_MS > now;
                        const past = !airingNow && airingAt < now;

                        return (
                            <View key={`${item.anime.slug}-${item.episode}`}>
                                {index > 0 && <Separator />}
                                <Link
                                    href={`/anime/${item.anime.slug}`}
                                    asChild
                                >
                                    <Pressable
                                        accessibilityRole="link"
                                        className={cn(
                                            'min-h-11 flex-row items-center gap-3 px-4 py-2 active:opacity-70',
                                            airingNow &&
                                                'border-primary-border border-y bg-primary',
                                        )}
                                    >
                                        <Text
                                            className={cn(
                                                'w-12 font-mono text-xs',
                                                airingNow
                                                    ? 'font-bold text-primary-foreground'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            {formatHistoryTime(item.airing_at)}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            className={cn(
                                                'min-w-0 flex-1 text-sm',
                                                airingNow &&
                                                    'font-medium text-primary-foreground',
                                                past && 'text-muted-foreground',
                                            )}
                                        >
                                            {getTitle(item.anime)}
                                        </Text>
                                        <Text
                                            className={cn(
                                                'text-xs',
                                                airingNow
                                                    ? 'text-primary-foreground'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            Епізод {item.episode}
                                        </Text>
                                    </Pressable>
                                </Link>
                            </View>
                        );
                    })}
                    {hiddenCount > 0 && (
                        <>
                            <Separator />
                            <Link href="/schedule" asChild>
                                <Pressable
                                    accessibilityRole="link"
                                    className="min-h-11 items-center justify-center active:opacity-70"
                                >
                                    <Text className="text-primary-foreground text-sm">
                                        Ще {hiddenCount}
                                    </Text>
                                </Pressable>
                            </Link>
                        </>
                    )}
                    {today?.length === 0 && (
                        <EmptyState
                            size="sm"
                            icon={<Icon as={CalendarClock} />}
                            title="Немає запланованих епізодів"
                        />
                    )}
                </Card>
            )}
        </WidgetSection>
    );
};

export default ScheduleWidget;
