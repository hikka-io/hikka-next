import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { History } from 'lucide-react-native';
import { View } from 'react-native';

import InlineError from '@/components/inline-error';
import HistoryRow from '@/components/list-items/history-row';
import HistoryRowSkeleton from '@/components/list-items/history-row-skeleton';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';

import { HISTORY_PREVIEW_SIZE, userHistoryPreviewOptions } from './queries';

const HistorySkeleton: FC = () => (
    <View className="gap-4">
        {Array.from({ length: HISTORY_PREVIEW_SIZE }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
            <HistoryRowSkeleton key={index} />
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
                        {items.map((item) => (
                            <HistoryRow
                                key={item.reference}
                                item={item}
                                relativeTime
                            />
                        ))}
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
