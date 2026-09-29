import type { FC } from 'react';

import MaterialSymbolsDraftRounded from '@/components/icons/material-symbols/MaterialSymbolsDraftRounded';
import ArticleItemCompact from '@/components/list-items/article-item-compact';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSession } from '@/features/auth/hooks/use-session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { Link, useParams } from '@/utils/navigation';

import { userArticlesPreviewOptions } from '../queries';

type Props = {};

const UserArticles: FC<Props> = () => {
    const { user } = useSession();
    const params = useParams();
    const { list: availableArticles } = useInfiniteList(
        userArticlesPreviewOptions(String(params.username)),
    );

    if (!availableArticles || availableArticles.length === 0) return null;

    return (
        <Block id="user-articles">
            <Header
                to={CONTENT_TYPE_LINKS.article}
                search={{ author: params.username }}
            >
                <HeaderContainer>
                    <HeaderTitle>Статті</HeaderTitle>
                    {user?.username === params.username && (
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        size="icon-sm"
                                        variant="outline"
                                        render={
                                            <Link
                                                to={CONTENT_TYPE_LINKS.article}
                                                search={{ draft: true }}
                                            />
                                        }
                                    />
                                }
                            >
                                <MaterialSymbolsDraftRounded className="size-4" />
                            </TooltipTrigger>
                            <TooltipContent>Чернетки</TooltipContent>
                        </Tooltip>
                    )}
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {availableArticles?.map((article) => (
                    <ArticleItemCompact key={article.slug} article={article} />
                ))}
            </div>
        </Block>
    );
};

export default UserArticles;
