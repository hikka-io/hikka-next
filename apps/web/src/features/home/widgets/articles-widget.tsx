import { type FC, useMemo, useState } from 'react';

import { range } from '@antfu/utils';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import {
    ArticlePreviewCard,
    ArticlePreviewCardSkeleton,
} from '@/components/list-items';
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
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';

import {
    HOME_ARTICLES_NEWEST_SORT,
    HOME_ARTICLES_POPULAR_SORT,
    HOME_ARTICLES_SIZE,
    homeArticlesOptions,
} from '../queries';
import type { WidgetProps } from '../types';

type ArticlesTab = 'popular' | 'newest' | 'own';

const ArticlesWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [tab, setTab] = useState<ArticlesTab>('newest');

    const isOwn = Boolean(user) && tab === 'own';

    const { list: published, isLoading: isPublishedLoading } = useInfiniteList(
        homeArticlesOptions(
            isOwn && user
                ? { sort: HOME_ARTICLES_NEWEST_SORT, author: user.username }
                : {
                      sort:
                          tab === 'popular'
                              ? HOME_ARTICLES_POPULAR_SORT
                              : HOME_ARTICLES_NEWEST_SORT,
                  },
        ),
    );

    const { list: drafts, isLoading: isDraftsLoading } = useInfiniteList(
        homeArticlesOptions({
            sort: HOME_ARTICLES_NEWEST_SORT,
            author: user?.username,
            draft: true,
        }),
        { enabled: isOwn },
    );

    const list = useMemo(() => {
        if (!isOwn) return published;

        return [...(drafts ?? []), ...(published ?? [])].slice(
            0,
            HOME_ARTICLES_SIZE,
        );
    }, [isOwn, published, drafts]);

    const isLoading = isPublishedLoading || isDraftsLoading;

    return (
        <Card className="p-0" id="articles">
            <Block className="w-full gap-4 py-4">
                <Header
                    to={CONTENT_TYPE_LINKS.article}
                    search={
                        isOwn && user ? { author: user.username } : undefined
                    }
                    className="px-4"
                >
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Статті</HeaderTitle>
                        {user && (
                            <Button
                                size="icon-sm"
                                variant="outline"
                                render={
                                    <Link
                                        to={`${CONTENT_TYPE_LINKS.article}/new`}
                                    />
                                }
                            >
                                <MaterialSymbolsAddRounded />
                            </Button>
                        )}
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>

                <Tabs
                    value={tab}
                    onValueChange={(value) => setTab(value as ArticlesTab)}
                    className="mx-4"
                >
                    <TabsList size="sm" className="w-full">
                        <TabsTrigger value="newest">Нові</TabsTrigger>
                        <TabsTrigger value="popular">Популярні</TabsTrigger>
                        {user && <TabsTrigger value="own">Мої</TabsTrigger>}
                    </TabsList>
                </Tabs>

                <div className="flex flex-col px-2">
                    {isLoading &&
                        range(0, HOME_ARTICLES_SIZE).map((i) => (
                            <ArticlePreviewCardSkeleton key={i} />
                        ))}

                    {!isLoading &&
                        list?.map((article) => (
                            <ArticlePreviewCard
                                key={article.slug}
                                article={article}
                            />
                        ))}

                    {!isLoading && (!list || list.length === 0) && (
                        <EmptyState
                            size="sm"
                            icon={<MaterialSymbolsDynamicFeedRounded />}
                            title={
                                isOwn ? 'У вас ще немає статей' : 'Немає статей'
                            }
                        />
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default ArticlesWidget;
