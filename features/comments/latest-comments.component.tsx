'use client';

import { FC } from 'react';

import GlobalComment from '@/components/comments/global-comment';
import LoadMoreButton from '@/components/load-more-button';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import Stack from '@/components/ui/stack';

import useGlobalComments from '@/services/hooks/comments/use-global-comments';
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
            <Stack extended extendedSize={3} size={3}>
                {list?.map((item, index) => (
                    <Card key={item.reference}>
                        <Badge
                            variant="secondary"
                            className="absolute -top-3 left-4 z-[1]"
                        >
                            #{index + 1}
                        </Badge>
                        <GlobalComment
                            href={`/comments/${item.content_type}/${item.slug}`}
                            comment={item}
                        />
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
