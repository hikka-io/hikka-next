import type { FC } from 'react';

import { range } from '@antfu/utils';

import type { ArticlesSearch } from '@hikka/core';
import { CONTENT_TYPE_LINKS } from '@hikka/core';

import FiltersNotFound from '@/components/filters-not-found';
import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePageTitleAnchor } from '@/features/app-shell';
import { FiltersModal } from '@/features/filters';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { Link, useRouteSearch } from '@/utils/navigation';

import { articleListOptions } from '../queries';
import ArticleCategoryChips from './article-category-chips';
import { ArticleFiltersBody } from './article-filters';
import ArticleItem from './article-item';
import ArticleItemSkeleton from './article-item-skeleton';
import { ARTICLE_FILTERS_PRESERVE } from './constants';

type Props = {};

const SKELETON_COUNT = 3;

const ArticleList: FC<Props> = () => {
    const titleAnchor = usePageTitleAnchor();
    const { user } = useSession();
    const search = useRouteSearch<ArticlesSearch>();

    const {
        ref,
        list,
        pagination,
        fetchNextPage,
        isFetchingNextPage,
        isPending,
        hasNextPage,
    } = useInfiniteList(articleListOptions(search));

    return (
        <Block>
            <Header>
                <HeaderTitle ref={titleAnchor} as="h1" size="page">
                    Статті
                </HeaderTitle>
                {user && (
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
                            <MaterialSymbolsAddRounded className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent>Нова стаття</TooltipContent>
                    </Tooltip>
                )}
                <HeaderActions className="md:hidden">
                    <FiltersModal
                        preserve={ARTICLE_FILTERS_PRESERVE}
                        body={
                            <ArticleFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />
                        }
                    >
                        <Button variant="outline" size="md">
                            <AntDesignFilterFilled /> Фільтри
                        </Button>
                    </FiltersModal>
                </HeaderActions>
            </Header>
            <ArticleCategoryChips />
            <div className="-mx-4 flex flex-col divide-y divide-border border-t sm:mx-0">
                {isPending &&
                    range(0, SKELETON_COUNT).map((index) => (
                        <ArticleItemSkeleton key={index} />
                    ))}
                {list?.map((article) => (
                    <ArticleItem article={article} key={article.slug} />
                ))}
                {(!list || list.length === 0) && !isPending && (
                    <div className="px-4 py-4 sm:px-0">
                        <FiltersNotFound
                            search={{ categories: search.categories }}
                        />
                    </div>
                )}
                {hasNextPage && (
                    <div className="px-4 py-4 sm:px-0">
                        <LoadMoreButton
                            ref={ref}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                        />
                    </div>
                )}
            </div>
        </Block>
    );
};

export default ArticleList;
