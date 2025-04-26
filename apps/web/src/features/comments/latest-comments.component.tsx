'use client';

import { useCommentList } from '@hikka/react';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import Stack from '@/components/ui/stack';

import { cn } from '@/utils/utils';

import GlobalComment from '../../components/comments/global-comment';
import LoadMoreButton from '../../components/load-more-button';

interface Props {
    className?: string;
}

const Comments: FC<Props> = ({ className }) => {
    const { list, hasNextPage, ref, isFetchingNextPage, fetchNextPage } =
        useCommentList();

    return (
        <Block className={cn(className)}>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">Останні коментарі</HeaderTitle>
                </HeaderContainer>
            </Header>
            <Stack
                extended
                extendedSize={3}
                size={3}
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
                {list?.map((item, index) => (
                    <Card key={item.reference}>
                        <Badge
                            variant="secondary"
                            className="absolute -top-3 left-4 z-[1]"
                        >
                            #{index + 1}
                        </Badge>
                        <GlobalComment
                            href={`/comments/${item.content_type}/${item.preview.slug}`}
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
