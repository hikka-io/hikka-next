import type { FC } from 'react';

import { View } from 'react-native';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Card from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

const GENRE_WIDTHS = ['w-16', 'w-20', 'w-14'] as const;
const SYNOPSIS_LINES = 6;
const DETAIL_ROWS = 4;

const ContentDetailSkeleton: FC = () => (
    <View accessibilityLabel="Завантаження" className="gap-6">
        <View className="gap-4">
            <PosterCardSkeleton hasTitle={false} className="w-48 self-center" />
            <View>
                <SkeletonText
                    className="text-2xl leading-8"
                    barClassName="w-3/4"
                />
                <SkeletonText className="text-sm" barClassName="w-1/2" />
            </View>
            <View className="flex-row gap-1.5">
                {GENRE_WIDTHS.map((width) => (
                    <Skeleton
                        key={width}
                        className={cn('h-5 rounded-sm', width)}
                    />
                ))}
            </View>
            <Skeleton className="h-14 rounded-md" />
        </View>
        <View className="gap-3">
            <Header>
                <SkeletonText
                    className="text-lg leading-7"
                    barClassName="w-16"
                />
            </Header>
            <SkeletonText
                className="text-base leading-6"
                lines={SYNOPSIS_LINES}
            />
        </View>
        <Card className="px-0">
            <View className="gap-4 px-4">
                {Array.from({ length: DETAIL_ROWS }, (_, index) => (
                    <View
                        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                        key={index}
                        className="flex-row justify-between"
                    >
                        <SkeletonText
                            className="text-sm leading-tight"
                            barClassName="w-20"
                        />
                        <SkeletonText
                            className="text-sm leading-tight"
                            barClassName="w-24"
                        />
                    </View>
                ))}
            </View>
        </Card>
    </View>
);

export default ContentDetailSkeleton;
