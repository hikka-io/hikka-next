import type { ReactElement } from 'react';

import { FlatList, type LayoutChangeEvent, View } from 'react-native';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Button } from '@/components/ui/button';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Text } from '@/components/ui/text';

const ITEM_CLASS = 'w-28';
const VISIBLE_CELLS = 4;

type Props<T> = {
    title: string;
    items: T[] | undefined;
    skeletonCount: number;
    keyExtractor: (item: T) => string;
    renderItem: (item: T) => ReactElement;
    description?: boolean;
    subtitles?: boolean;
    error?: boolean;
    onRetry?: () => void;
    onLayout?: (event: LayoutChangeEvent) => void;
};

function PosterRow<T>({
    title,
    items,
    skeletonCount,
    keyExtractor,
    renderItem,
    description = false,
    subtitles = false,
    error = false,
    onRetry,
    onLayout,
}: Props<T>) {
    return (
        <View className="gap-3" onLayout={onLayout}>
            <Header>
                <HeaderTitle>{title}</HeaderTitle>
            </Header>
            {error ? (
                <View className="flex-row items-center justify-between gap-3">
                    <Text className="flex-1 text-muted-foreground text-sm">
                        Не вдалося завантажити
                    </Text>
                    <Button size="sm" variant="outline" onPress={onRetry}>
                        Повторити
                    </Button>
                </View>
            ) : items ? (
                <FlatList
                    horizontal
                    data={items}
                    keyExtractor={keyExtractor}
                    renderItem={({ item }) => (
                        <View className={ITEM_CLASS}>{renderItem(item)}</View>
                    )}
                    showsHorizontalScrollIndicator={false}
                    className="-mx-4"
                    contentContainerClassName="gap-3 px-4"
                />
            ) : (
                <View className="-mx-4 flex-row gap-3 overflow-hidden px-4">
                    {Array.from(
                        { length: Math.min(skeletonCount, VISIBLE_CELLS) },
                        (_, index) => (
                            <PosterCardSkeleton
                                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                                key={index}
                                description={description}
                                subtitles={subtitles}
                                className={ITEM_CLASS}
                            />
                        ),
                    )}
                </View>
            )}
        </View>
    );
}

export default PosterRow;
