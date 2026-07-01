import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import { getArticlesInfiniteOptions } from '@hikka/api';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
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
import {
    ArticlePreviewCard,
    ArticlePreviewCardSkeleton,
} from '@/features/articles';
import { useSession } from '@/features/auth/hooks/use-session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

import type { WidgetProps } from '../../constants';

const SIZE = 3;

const POPULAR_SORT = ['vote_score:desc'];
const NEWEST_SORT = ['created:desc'];

type ArticlesTab = 'popular' | 'newest' | 'own';

const ArticlesWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [tab, setTab] = useState<ArticlesTab>('popular');

    const isOwn = Boolean(user) && tab === 'own';

    const { list, isLoading } = useInfiniteList(
        getArticlesInfiniteOptions({
            body:
                isOwn && user
                    ? {
                          sort: NEWEST_SORT,
                          author: user.username,
                          draft: true,
                      }
                    : {
                          sort: tab === 'popular' ? POPULAR_SORT : NEWEST_SORT,
                      },
            query: { size: SIZE },
        }),
    );

    return (
        <Card className="bg-secondary/20 p-0 backdrop-blur-xl" id="articles">
            <Block className="w-full gap-4 py-4">
                <Header href="/articles" className="px-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Статті</HeaderTitle>
                        {user && (
                            <Button asChild size="icon-sm" variant="outline">
                                <Link to={`${CONTENT_TYPE_LINKS.article}/new`}>
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
                        value && setTab(value as ArticlesTab)
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

                <div className="flex flex-col px-2">
                    {isLoading &&
                        range(0, SIZE).map((i) => (
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
