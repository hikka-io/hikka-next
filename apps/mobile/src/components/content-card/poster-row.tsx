import type { ReactElement } from 'react';

import {
    ActivityIndicator,
    FlatList,
    type LayoutChangeEvent,
    View,
} from 'react-native';

import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { cn } from '@/utils/cn';

import PosterRowSkeleton, {
    type PosterRowSkeletonProps,
} from './poster-row-skeleton';

type Props<T> = {
    items: T[] | undefined;
    keyExtractor: (item: T) => string;
    renderItem: (item: T) => ReactElement;
    title?: string;
    error?: unknown;
    onRetry?: () => void;
    // Paged rows load the next page as the strip nears its end.
    onEndReached?: () => void;
    isFetchingNextPage?: boolean;
    skeleton?: Omit<PosterRowSkeletonProps, 'itemClassName'>;
    itemClassName?: string;
    className?: string;
    onLayout?: (event: LayoutChangeEvent) => void;
};

/**
 * A horizontal strip of poster cards that bleeds out of the parent's `px-4` gutter to the screen edges.
 * `items` undefined is loading; an error shows only while there is nothing to show.
 */
function PosterRow<T>({
    items,
    keyExtractor,
    renderItem,
    title,
    error,
    onRetry,
    onEndReached,
    isFetchingNextPage = false,
    skeleton,
    itemClassName = 'w-28',
    className,
    onLayout,
}: Props<T>) {
    return (
        <View className={cn('gap-3', className)} onLayout={onLayout}>
            {title && (
                <Header>
                    <HeaderTitle>{title}</HeaderTitle>
                </Header>
            )}
            {items ? (
                <FlatList
                    horizontal
                    data={items}
                    keyExtractor={keyExtractor}
                    renderItem={({ item }) => (
                        <View className={itemClassName}>
                            {renderItem(item)}
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                    className="-mx-4"
                    contentContainerClassName="gap-3 px-4"
                    onEndReachedThreshold={0.5}
                    onEndReached={
                        onEndReached && !isFetchingNextPage
                            ? onEndReached
                            : undefined
                    }
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <View className="h-40 justify-center">
                                <ActivityIndicator />
                            </View>
                        ) : null
                    }
                />
            ) : error && onRetry ? (
                <ErrorState variant="inline" onRetry={onRetry} />
            ) : (
                <PosterRowSkeleton
                    {...skeleton}
                    itemClassName={itemClassName}
                />
            )}
        </View>
    );
}

export default PosterRow;
