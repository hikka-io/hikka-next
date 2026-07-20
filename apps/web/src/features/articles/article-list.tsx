import type { FC } from 'react';

import {
    type ArticleCategoryEnum,
    getArticlesInfiniteOptions,
} from '@hikka/api';

import FiltersNotFound from '@/components/filters-not-found';
import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import MaterialSymbolsAddRounded from '@/components/icons/watch-status/planned';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { useSession } from '@/features/auth/hooks/use-session';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';
import type { ArticlesSearch } from '@/utils/search-schemas';

import ArticleFiltersModal from './article-filters-modal';
import ArticleItem from './article-item/article-item';
import ArticleItemSkeleton from './article-item/article-item-skeleton';

type Props = {};

const ArticleList: FC<Props> = () => {
    const { user } = useSession();
    const search = useFilterSearch<ArticlesSearch>();

    const author = search.author || undefined;
    const tags = search.tags || undefined;
    const draft = Boolean(search.draft) ?? false;
    const categories = (search.categories as ArticleCategoryEnum[]) || [];

    const selectedCategory = categories.length === 1 && categories[0];

    const {
        ref,
        list,
        pagination,
        fetchNextPage,
        isFetchingNextPage,
        isPending,
        hasNextPage,
    } = useInfiniteList(
        getArticlesInfiniteOptions({
            body: {
                categories,
                author,
                sort: expandSort('article', search.sort, search.order),
                tags,
                draft,
            },
        }),
    );

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">
                        {selectedCategory
                            ? ARTICLE_CATEGORY_OPTIONS[selectedCategory]
                                  ?.title_ua
                            : 'Статті'}
                    </HeaderTitle>
                    {user && (
                        <Button asChild size="icon-sm" variant="outline">
                            <Link to={`${CONTENT_TYPE_LINKS.article}/new`}>
                                <MaterialSymbolsAddRounded className="size-4" />
                            </Link>
                        </Button>
                    )}
                </HeaderContainer>
                <ArticleFiltersModal>
                    <Button
                        variant="outline"
                        size="md"
                        className="flex md:hidden"
                    >
                        <AntDesignFilterFilled /> Фільтри
                    </Button>
                </ArticleFiltersModal>
            </Header>
            <div
                className={cn(
                    '-mx-4 flex flex-col max-md:[&>*+*]:-mt-px md:mx-0 md:gap-6',
                    (!list || list.length === 0) && 'mx-0',
                )}
            >
                {isPending && <ArticleItemSkeleton />}
                {list?.map((article) => (
                    <ArticleItem article={article} key={article.slug} />
                ))}
                {(!list || list.length === 0) && !isPending && (
                    <FiltersNotFound />
                )}
                {hasNextPage && (
                    <LoadMoreButton
                        className="max-md:mt-6"
                        ref={ref}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </Block>
    );
};

export default ArticleList;
