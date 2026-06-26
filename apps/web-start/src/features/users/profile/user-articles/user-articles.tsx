import type { FC } from 'react';

import { getArticlesInfiniteOptions } from '@hikka/api';
import { useSession } from '@/features/auth/hooks/use-session';

import MaterialSymbolsDraftRounded from '@/components/icons/material-symbols/MaterialSymbolsDraftRounded';
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
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link, useParams } from '@/utils/navigation';

import ArticleItem from './components/article-item';

type Props = {};

const UserArticles: FC<Props> = () => {
    const { user } = useSession();
    const params = useParams();
    const { list: availableArticles } = useInfiniteList(
        getArticlesInfiniteOptions({
            body: { author: String(params.username) },
            query: { size: 3 },
        }),
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
                            <TooltipTrigger asChild>
                                <Button
                                    asChild
                                    size="icon-sm"
                                    variant="outline"
                                >
                                    <Link
                                        to={CONTENT_TYPE_LINKS.article}
                                        search={{ draft: true }}
                                    >
                                        <MaterialSymbolsDraftRounded className="size-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Чернетки</TooltipContent>
                        </Tooltip>
                    )}
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {availableArticles?.map((article) => (
                    <ArticleItem key={article.slug} article={article} />
                ))}
            </div>
        </Block>
    );
};

export default UserArticles;
