import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import { getCollectionsInfiniteOptions } from '@hikka/api';

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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSession } from '@/features/auth/hooks/use-session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { Link } from '@/utils/navigation';

import type { WidgetProps } from '../../constants';
import CollectionWidgetItem from './components/collection-widget-item';
import CollectionWidgetSkeleton from './components/collection-widget-skeleton';

const SIZE = 3;

const POPULAR_SORT = ['system_ranking:desc', 'created:desc'];
const NEWEST_SORT = ['created:desc'];

type CollectionsTab = 'popular' | 'newest' | 'own';

const CollectionsWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [tab, setTab] = useState<CollectionsTab>('popular');

    const isOwn = Boolean(user) && tab === 'own';

    const { list, isLoading } = useInfiniteList(
        getCollectionsInfiniteOptions({
            body:
                isOwn && user
                    ? {
                          sort: NEWEST_SORT,
                          author: user.username,
                          only_public: false,
                      }
                    : {
                          sort: tab === 'popular' ? POPULAR_SORT : NEWEST_SORT,
                      },
            query: { size: SIZE },
        }),
    );

    return (
        <Card className="bg-secondary/20 p-0 backdrop-blur-xl" id="collections">
            <Block className="w-full gap-4 py-4">
                <Header href="/collections" className="px-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Колекції</HeaderTitle>
                        {user && (
                            <Button asChild size="icon-sm" variant="outline">
                                <Link to="/collections/new">
                                    <MaterialSymbolsAddRounded />
                                </Link>
                            </Button>
                        )}
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>

                <ToggleGroup
                    type="single"
                    value={tab}
                    onValueChange={(value: string) =>
                        value && setTab(value as CollectionsTab)
                    }
                    size="badge"
                    className="mx-4"
                >
                    <ToggleGroupItem value="popular" className="flex-1">
                        Популярні
                    </ToggleGroupItem>
                    <ToggleGroupItem value="newest" className="flex-1">
                        Нові
                    </ToggleGroupItem>
                    {user && (
                        <ToggleGroupItem value="own" className="flex-1">
                            Мої
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>

                <div className="flex flex-col gap-1 px-2">
                    {isLoading &&
                        range(0, SIZE).map((i) => (
                            <CollectionWidgetSkeleton key={i} />
                        ))}

                    {!isLoading &&
                        list?.map((collection) => (
                            <CollectionWidgetItem
                                key={collection.reference}
                                collection={collection}
                                hideAuthor={isOwn}
                            />
                        ))}

                    {!isLoading && (!list || list.length === 0) && (
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
