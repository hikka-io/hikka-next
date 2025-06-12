'use client';

import { useSearchArticles, useSession } from '@hikka/react';
import Link from 'next/link';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { cn } from '@/utils/utils';

import MaterialSymbolsAddRounded from '../../../components/icons/material-symbols/MaterialSymbolsAddRounded';
import ArticleCard from './article-card';

interface Props {
    className?: string;
}

const Articles: FC<Props> = ({ className }) => {
    const { user: loggedUser } = useSession();

    const { list } = useSearchArticles({
        args: {
            sort: ['created:desc'],
        },
        paginationArgs: {
            size: 3,
        },
    });

    return (
        <Block className={cn(className)}>
            <Header href="/articles">
                <HeaderContainer>
                    <HeaderTitle variant="h2">Статті</HeaderTitle>
                    {loggedUser?.username && (
                        <Button asChild size="icon-sm" variant="outline">
                            <Link href="/articles/new">
                                <MaterialSymbolsAddRounded />
                            </Link>
                        </Button>
                    )}
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={3} className="grid-min-20">
                {list?.map((item) => (
                    <ArticleCard key={item.slug} article={item} />
                ))}
            </Stack>
        </Block>
    );
};

export default Articles;
