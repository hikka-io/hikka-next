'use client';

import Link from 'next/link';
import { FC } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import ContentCard from '@/components/content-card/content-card';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useSession from '@/services/hooks/auth/use-session';
import useCollections from '@/services/hooks/collections/use-collections';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Collections: FC<Props> = ({ className }) => {
    const { user: loggedUser } = useSession();

    const { data: collections } = useCollections({
        sort: 'created',
        page: 1,
    });

    const filteredCollections = collections?.list?.slice(0, 8);

    return (
        <Block className={cn(className)}>
            <Header title="Колекції" href="/collections">
                {loggedUser?.username && (
                    <Button asChild size="icon-sm" variant="outline">
                        <Link href="/collections/new">
                            <MaterialSymbolsAddRounded />
                        </Link>
                    </Button>
                )}
            </Header>
            <Stack size={8} className="-mt-4 pt-4">
                {filteredCollections &&
                    filteredCollections.map((item) => (
                        <ContentCard
                            key={item.reference}
                            title={item.title}
                            image={item.collection[0].content.image}
                            href={`/collections/${item.reference}`}
                            titleClassName={cn(
                                item.spoiler && 'spoiler-blur-md',
                            )}
                            containerClassName={cn(
                                item.nsfw && 'spoiler-blur-md',
                            )}
                            leftSubtitle={(item.nsfw && '+18') || undefined}
                            rightSubtitle={
                                (item.spoiler && 'Спойлери') || undefined
                            }
                        />
                    ))}
            </Stack>
        </Block>
    );
};

export default Collections;
