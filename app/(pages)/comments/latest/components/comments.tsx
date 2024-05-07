'use client';

import * as React from 'react';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import LoadMoreButton from '@/components/load-more-button';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import HorizontalCard from '@/components/ui/horizontal-card';
import NotFound from '@/components/ui/not-found';
import Stack from '@/components/ui/stack';
import useGlobalComments from '@/services/hooks/comments/useGlobalComments';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Comments: FC<Props> = ({ className }) => {
    const { list, hasNextPage, ref, isFetchingNextPage, fetchNextPage } =
        useGlobalComments();

    return (
        <Block className={cn(className)}>
            <Header title="Останні коментарі" />
            <Stack
                size={3}
                extended
                extendedSize={3}
                className="grid-cols-1 md:grid-cols-1"
            >
                {list?.map((item, index) => (
                    <Card key={item.reference}>
                        <Badge
                            variant="secondary"
                            className="absolute -top-3 left-4 z-[1]"
                        >
                            #{index + 1}
                        </Badge>
                        <HorizontalCard
                            image={item.author.avatar}
                            imageRatio={1}
                            description={item.text}
                            key={item.created}
                            title={item.author.username}
                            href={`/u/${item.author.username}`}
                            createdAt={item.created}
                        >
                            <ContentCard
                                className="w-10"
                                poster={item.image}
                                href={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.slug}`}
                            />
                        </HorizontalCard>
                    </Card>
                ))}
                {list?.length === 0 && (
                    <NotFound
                        title="Історія відсутня"
                        description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                    />
                )}
            </Stack>
            {list && hasNextPage && (
                <LoadMoreButton
                    ref={ref}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            )}
        </Block>
    );
};

export default Comments;
