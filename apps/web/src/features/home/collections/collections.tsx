'use client';

import { useSearchCollections, useSession } from '@hikka/react';
import Link from 'next/link';
import { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
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

import CollectionCard from './collection-card';

interface Props {
    className?: string;
}

const Collections: FC<Props> = ({ className }) => {
    const { user: loggedUser } = useSession();

    const { list } = useSearchCollections({
        args: {
            sort: ['created:desc'],
        },
        paginationArgs: {
            size: 3,
        },
    });

    return (
        <Block className={cn(className)}>
            <Header href="/collections">
                <HeaderContainer>
                    <HeaderTitle variant="h2">Колекції</HeaderTitle>
                    {loggedUser?.username && (
                        <Button asChild size="icon-sm" variant="outline">
                            <Link href="/collections/new">
                                <MaterialSymbolsAddRounded />
                            </Link>
                        </Button>
                    )}
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={3} className="grid-min-20">
                {list?.map((item) => (
                    <CollectionCard
                        maxPreviewItems={2}
                        key={item.reference}
                        collection={item}
                    />
                ))}
            </Stack>
        </Block>
    );
};

export default Collections;
