import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { Link } from '@/utils/navigation';

import {
    COLLECTIONS_PREVIEW_SIZE,
    homeCollectionsOptions,
} from '../../queries';
import type { HomeCollectionsTab, WidgetProps } from '../../types';
import CollectionWidgetItem from './components/collection-widget-item';
import CollectionWidgetSkeleton from './components/collection-widget-skeleton';

const CollectionsWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [tab, setTab] = useState<HomeCollectionsTab>('newest');

    const isOwn = Boolean(user) && tab === 'own';

    const { ref, visible } = useVisibleOnce();
    const { list, isPending } = useInfiniteList(
        homeCollectionsOptions(tab, user?.username ?? undefined),
        { enabled: visible },
    );

    return (
        <Card ref={ref} className="p-0" id="collections">
            <Block className="w-full gap-4 py-4">
                <Header to="/collections" search={{ page: 1 }} className="px-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Колекції</HeaderTitle>
                        {user && (
                            <Button
                                size="icon-sm"
                                variant="outline"
                                render={<Link to="/collections/new" />}
                            >
                                <MaterialSymbolsAddRounded />
                            </Button>
                        )}
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>

                <Tabs
                    value={tab}
                    onValueChange={(value) =>
                        setTab(value as HomeCollectionsTab)
                    }
                    className="mx-4"
                >
                    <TabsList size="sm" className="w-full">
                        <TabsTrigger value="newest">Нові</TabsTrigger>
                        <TabsTrigger value="popular">Популярні</TabsTrigger>
                        {user && <TabsTrigger value="own">Мої</TabsTrigger>}
                    </TabsList>
                </Tabs>

                <div className="flex flex-col gap-1 px-2">
                    {isPending &&
                        range(0, COLLECTIONS_PREVIEW_SIZE).map((i) => (
                            <CollectionWidgetSkeleton key={i} />
                        ))}

                    {!isPending &&
                        list?.map((collection) => (
                            <CollectionWidgetItem
                                key={collection.reference}
                                collection={collection}
                            />
                        ))}

                    {!isPending && (!list || list.length === 0) && (
                        <EmptyState
                            size="sm"
                            icon={<MaterialSymbolsStack />}
                            title={
                                isOwn
                                    ? 'У вас ще немає колекцій'
                                    : 'Немає колекцій'
                            }
                        />
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default CollectionsWidget;
