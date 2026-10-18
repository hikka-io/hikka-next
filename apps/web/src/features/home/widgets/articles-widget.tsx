import { type FC, useMemo, useState } from 'react';

import { range } from '@antfu/utils';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import {
    ArticlePreviewCard,
    ArticlePreviewCardSkeleton,
} from '@/components/list-items';
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
        <Block variant="card" id="articles">
            <Header>
                <HeaderTitle
                    to={CONTENT_TYPE_LINKS.article}
                    search={
                        isOwn && user ? { author: user.username } : undefined
                    }
                >
                    Статті
                </HeaderTitle>
                {user && (
                    <HeaderActions>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        size="icon-sm"
                                        variant="outline"
                                        aria-label="Нова стаття"
                                        render={
                                            <Link
                                                to={`${CONTENT_TYPE_LINKS.article}/new`}
                                            />
                                        }
                                    />
                                }
                            >
                                <MaterialSymbolsAddRounded />
                            </TooltipTrigger>
                            <TooltipContent>Нова стаття</TooltipContent>
                        </Tooltip>
                    </HeaderActions>
                )}
            </Header>

            <Tabs
                value={tab}
                onValueChange={(value) => setTab(value as ArticlesTab)}
            >
                <TabsList size="sm" className="w-full">
                    <TabsTrigger value="newest">Нові</TabsTrigger>
                    <TabsTrigger value="popular">Популярні</TabsTrigger>
                    {user && <TabsTrigger value="own">Мої</TabsTrigger>}
                </TabsList>
            </Tabs>

            <BlockBleed>
                {isLoading &&
                    range(0, HOME_ARTICLES_SIZE).map((i) => (
                        <ArticlePreviewCardSkeleton
                            key={i}
                            titleLines={1}
                            className="rounded-none px-4"
                        />
                    ))}

                {!isLoading &&
                    list?.map((article) => (
                        <ArticlePreviewCard
                            key={article.slug}
                            article={article}
                            className="rounded-none px-4"
                        />
                    ))}

                {!isLoading && (!list || list.length === 0) && (
                    <EmptyState
                        size="sm"
                        icon={<MaterialSymbolsDynamicFeedRounded />}
                        title={isOwn ? 'У вас ще немає статей' : 'Немає статей'}
                    />
                )}
            </BlockBleed>
        </Block>
    );
};

export default ArticlesWidget;
