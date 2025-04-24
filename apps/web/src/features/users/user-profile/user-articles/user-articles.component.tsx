'use client';

import { useArticlesList, useSession } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

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

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import ArticleItem from './article-item';

interface Props {}

const UserArticles: FC<Props> = () => {
    const { user } = useSession();
    const params = useParams();
    const { list } = useArticlesList({
        args: {
            author: String(params.username),
        },
    });

    if (!list || list.length === 0) return null;

    const filteredNews = list?.slice(0, 3);

    return (
        <Block>
            <Header
                href={`${CONTENT_TYPE_LINKS.article}?author=${params.username}`}
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
                                        href={`${CONTENT_TYPE_LINKS.article}/?draft=true`}
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
                {filteredNews?.map((article) => (
                    <ArticleItem key={article.slug} article={article} />
                ))}
            </div>
        </Block>
    );
};

export default UserArticles;
