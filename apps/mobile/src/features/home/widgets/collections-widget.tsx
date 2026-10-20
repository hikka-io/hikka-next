import { type FC, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Layers } from 'lucide-react-native';
import { View } from 'react-native';

import type { CommunityTab } from '@hikka/core';

import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';
import { Separator } from '@/components/ui/separator';
import { CollectionRow, CollectionRowSkeleton } from '@/features/collections';

import { flattenPages } from '../flatten-pages';
import { COLLECTIONS_PREVIEW_SIZE, homeCollectionsOptions } from '../queries';
import WidgetSection from '../widget-section';

type Props = {
    username?: string;
};

const CollectionsWidget: FC<Props> = ({ username }) => {
    const [tab, setTab] = useState<CommunityTab>('newest');
    const own = !!username && tab === 'own';
    const { data, isPending, isError, refetch } = useInfiniteQuery(
        homeCollectionsOptions(tab, username),
    );
    const list = flattenPages(data);

    const tabs = [
        { value: 'newest' as const, label: 'Нові' },
        { value: 'popular' as const, label: 'Популярні' },
        ...(username ? [{ value: 'own' as const, label: 'Мої' }] : []),
    ];

    return (
        <WidgetSection title="Колекції" href="/collections">
            <SegmentedControl
                options={tabs}
                value={tab}
                onValueChange={setTab}
            />
            {isError && <ErrorState variant="section" onRetry={refetch} />}
            {(isPending || (list && list.length > 0)) && (
                <Card className="gap-0 overflow-hidden p-0">
                    {isPending &&
                        Array.from(
                            { length: COLLECTIONS_PREVIEW_SIZE },
                            (_, index) => (
                                <View key={index}>
                                    {index > 0 && <Separator />}
                                    <CollectionRowSkeleton />
                                </View>
                            ),
                        )}
                    {list?.map((collection, index) => (
                        <View key={collection.reference}>
                            {index > 0 && <Separator />}
                            <CollectionRow collection={collection} />
                        </View>
                    ))}
                </Card>
            )}
            {list?.length === 0 && (
                <EmptyState
                    size="sm"
                    bordered
                    icon={<Icon as={Layers} />}
                    title={own ? 'У вас ще немає колекцій' : 'Немає колекцій'}
                />
            )}
        </WidgetSection>
    );
};

export default CollectionsWidget;
