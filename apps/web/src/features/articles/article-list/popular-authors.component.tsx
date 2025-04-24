'use client';

import { useArticleStats } from '@hikka/react';
import { FC } from 'react';

import FollowButton from '@/components/follow-button';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {}

const PopularAuthors: FC<Props> = () => {
    const { data: articleTop } = useArticleStats();

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Популярні автори</HeaderTitle>
                </HeaderContainer>
            </Header>
            <div className="flex flex-col gap-6">
                {articleTop?.authors.slice(0, 4).map((author) => (
                    <HorizontalCard
                        key={author.user.username}
                        href={`/u/${author.user.username}`}
                    >
                        <HorizontalCardImage
                            imageRatio={1}
                            image={author.user.avatar}
                        />
                        <HorizontalCardContainer>
                            <HorizontalCardTitle>
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
    );
};

export default PopularAuthors;
