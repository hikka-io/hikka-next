'use client';

import { useArticleStats } from '@hikka/react';
import { FC } from 'react';

import FollowButton from '@/features/common/follow-button';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props { }

const PopularAuthors: FC<Props> = () => {
    const { data: articleTop } = useArticleStats();

    return (
        <Card className="bg-secondary/20 backdrop-blur-xl">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant='h4'>Популярні автори</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <div className="flex flex-col gap-6">
                    {articleTop?.authors.slice(0, 4).map((author) => (
                        <HorizontalCard
                            key={author.user.username}
                        >
                            <HorizontalCardImage
                                imageRatio={1}
                                className='w-10'
                                image={author.user.avatar}
                                href={`/u/${author.user.username}`}
                            />
                            <HorizontalCardContainer>
                                <HorizontalCardTitle href={`/u/${author.user.username}`}>
                                    {author.user.username}
                                </HorizontalCardTitle>
                                <HorizontalCardDescription className="line-clamp-1">
                                    {author.user.description}
                                </HorizontalCardDescription>
                            </HorizontalCardContainer>
                            <FollowButton
                                size="icon-md"
                                iconOnly
                                user={author.user}
                            />
                        </HorizontalCard>
                    ))}
                </div>
            </Block>
        </Card>
    );
};

export default PopularAuthors;
