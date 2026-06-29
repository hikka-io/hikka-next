import type { FC } from 'react';

import { commentsListInfiniteOptions } from '@hikka/api';

import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import LoadMoreButton from '@/components/load-more-button';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';

import GlobalComment from './global-comment';

type Props = {
    className?: string;
};

const Comments: FC<Props> = ({ className }) => {
    const { list, hasNextPage, ref, isFetchingNextPage, fetchNextPage } =
        useInfiniteList(commentsListInfiniteOptions());

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
                            className="absolute -top-3 left-4 z-1"
                        >
                            #{index + 1}
                        </Badge>
                        <GlobalComment
                            href={`/comments/${item.content_type}/${(item.preview as { slug?: string }).slug}`}
                            comment={item}
                        />
                    </Card>
                ))}
                {list?.length === 0 && (
                    <EmptyState
                        icon={<MaterialSymbolsAddCommentRounded />}
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
