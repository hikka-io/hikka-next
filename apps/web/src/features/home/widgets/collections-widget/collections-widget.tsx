import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import Block from '@/components/ui/block';
import BlockBleed from '@/components/ui/block-bleed';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
        <Block variant="card" ref={ref} id="collections">
            <Header>
                <HeaderTitle to="/collections" search={{ page: 1 }}>
                    Колекції
                </HeaderTitle>
                {user && (
                    <HeaderActions>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        size="icon-sm"
                                        variant="outline"
                                        aria-label="Нова колекція"
                                        render={<Link to="/collections/new" />}
                                    />
                                }
                            >
                                <MaterialSymbolsAddRounded />
                            </TooltipTrigger>
                            <TooltipContent>Нова колекція</TooltipContent>
                        </Tooltip>
                    </HeaderActions>
                )}
            </Header>

            <Tabs
                value={tab}
                onValueChange={(value) => setTab(value as HomeCollectionsTab)}
            >
                <TabsList size="sm" className="w-full">
                    <TabsTrigger value="newest">Нові</TabsTrigger>
                    <TabsTrigger value="popular">Популярні</TabsTrigger>
                    {user && <TabsTrigger value="own">Мої</TabsTrigger>}
                </TabsList>
            </Tabs>

            <BlockBleed className="gap-1">
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
                            isOwn ? 'У вас ще немає колекцій' : 'Немає колекцій'
                        }
                    />
                )}
            </BlockBleed>
        </Block>
    );
};

export default CollectionsWidget;
