import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { History } from 'lucide-react-native';
import { View } from 'react-native';

import { formatTimestamp, getTitle } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import InlineError from '@/components/inline-error';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

import {
    historyImportTitle,
    IMPORTS,
    summarizeHistory,
} from './history-summary';
import { HISTORY_PREVIEW_SIZE, userHistoryPreviewOptions } from './queries';

const ROUTE = {
    anime: '/anime',
    manga: '/manga',
    novel: '/novel',
} as const;

const HistorySkeleton: FC = () => (
    <View className="gap-4">
        {Array.from({ length: HISTORY_PREVIEW_SIZE }, (_, index) => (
            <View key={index} className="flex-row items-center gap-4">
                <Skeleton className="aspect-[0.7] w-12 rounded-lg" />
                <View className="flex-1 gap-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                </View>
            </View>
        ))}
    </View>
);

type Props = {
    username: string;
};

const HistorySection: FC<Props> = ({ username }) => {
    const { data, isPending, error, refetch } = useInfiniteQuery(
        userHistoryPreviewOptions(username),
    );
    const items = data?.pages[0]?.list.slice(0, HISTORY_PREVIEW_SIZE);

    return (
        <View className="px-4 pt-6">
            <Card className="gap-3">
                <Header>
                    <HeaderTitle>Історія</HeaderTitle>
                </Header>
                {isPending ? (
                    <HistorySkeleton />
                ) : error ? (
                    <InlineError onRetry={() => void refetch()} />
                ) : items && items.length > 0 ? (
                    <View className="gap-4">
                        {items.map((item) => {
                            const content = item.content;

                            return (
                                <HorizontalCard
                                    key={item.reference}
                                    href={
                                        content
                                            ? `${ROUTE[content.data_type]}/${content.slug}`
                                            : undefined
                                    }
                                >
                                    <HorizontalCardImage
                                        image={content?.image ?? undefined}
                                    />
                                    <HorizontalCardContainer>
                                        <HorizontalCardTitle
                                            titleMeta={
                                                <Text
                                                    maxFontSizeMultiplier={
                                                        DENSE_MAX_FONT_SCALE
                                                    }
                                                    className="shrink-0 text-muted-foreground text-xs"
                                                >
                                                    {
                                                        formatTimestamp(
                                                            item.created,
                                                            Date.now(),
                                                        ).label
                                                    }
                                                </Text>
                                            }
                                        >
                                            {content
                                                ? getTitle(content)
                                                : IMPORTS.includes(
                                                        item.history_type,
                                                    )
                                                  ? historyImportTitle(
                                                        item.history_type,
                                                    )
                                                  : 'Загальне'}
                                        </HorizontalCardTitle>
                                        <HorizontalCardDescription>
                                            {summarizeHistory(item)}
                                        </HorizontalCardDescription>
                                    </HorizontalCardContainer>
                                </HorizontalCard>
                            );
                        })}
                    </View>
                ) : (
                    <EmptyState
                        size="sm"
                        icon={<Icon as={History} />}
                        title="Історія відсутня"
                        description="Інформація оновиться після змін у списку"
                    />
                )}
            </Card>
        </View>
    );
};

export default HistorySection;
