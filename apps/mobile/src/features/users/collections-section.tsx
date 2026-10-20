import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { View } from 'react-native';

import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Separator } from '@/components/ui/separator';
import {
    AUTHOR_COLLECTIONS_PREVIEW_SIZE,
    authorCollectionsOptions,
    CollectionRow,
    CollectionRowSkeleton,
} from '@/features/collections';

type Props = {
    username: string;
};

/** The web's "Колекції" block: the author's newest collections with the total, hidden when there are none. */
const CollectionsSection: FC<Props> = ({ username }) => {
    const { data, isPending, error, refetch } = useInfiniteQuery({
        ...authorCollectionsOptions(username, { preview: true }),
        subscribed: useIsFocused(),
    });
    const items = data?.pages[0]?.list.slice(
        0,
        AUTHOR_COLLECTIONS_PREVIEW_SIZE,
    );

    if (!isPending && !error && !items?.length) return null;

    return (
        <View className="px-4 pt-6">
            <View className="gap-3">
                <Header>
                    <HeaderTitle
                        href={{
                            pathname: '/collections',
                            params: { author: username },
                        }}
                        count={data?.pages[0]?.pagination.total}
                        countPending={isPending}
                    >
                        Колекції
                    </HeaderTitle>
                </Header>
                {error ? (
                    <ErrorState
                        variant="inline"
                        onRetry={() => void refetch()}
                    />
                ) : (
                    <Card className="gap-0 overflow-hidden p-0">
                        {(
                            items ??
                            Array.from(
                                { length: AUTHOR_COLLECTIONS_PREVIEW_SIZE },
                                () => null,
                            )
                        ).map((collection, index) => (
                            <View
                                key={
                                    collection?.reference ?? `skeleton-${index}`
                                }
                            >
                                {index > 0 && <Separator />}
                                {collection ? (
                                    <CollectionRow
                                        collection={collection}
                                        compact
                                    />
                                ) : (
                                    <CollectionRowSkeleton compact />
                                )}
                            </View>
                        ))}
                    </Card>
                )}
            </View>
        </View>
    );
};

export default CollectionsSection;
