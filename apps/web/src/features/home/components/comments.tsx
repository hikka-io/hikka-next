'use client';

import { useLatestComments } from '@hikka/react';
import { FC } from 'react';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { cn } from '@/utils/utils';

import GlobalComment from '@/components/comments/global-comment';

interface Props {
    className?: string;
}

const Comments: FC<Props> = ({ className }) => {
    const { data: comments } = useLatestComments();

    return (
        <Block className={cn(className)}>
            <Header href="/comments/latest">
                <HeaderContainer>
                    <HeaderTitle variant="h2">Коментарі</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={3} className="grid-min-20">
                {comments?.map((item) => (
                    <Card key={item.reference}>
                        <GlobalComment
                            href={`/comments/${item.content_type}/${item.preview.slug}`}
                            comment={item}
                        />
                    </Card>
                ))}
            </Stack>
        </Block>
    );
};

export default Comments;

{
    /* <HorizontalCard
    image={item.author.avatar}
    imageRatio={1}
    description={item.text}
    descriptionHref={`/comments/${item.content_type}/${item.slug}`}
    key={item.created}
    title={item.author.username}
    href={`/u/${item.author.username}`}
    createdAt={item.created}
>
    <ContentCard
        className="w-10"
        image={item.image}
        href={`/comments/${item.content_type}/${item.slug}`}
    />
</HorizontalCard> */
}
