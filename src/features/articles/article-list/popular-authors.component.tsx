'use client';

import { useParams } from 'next/navigation';
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

import useArticleTop from '@/services/hooks/articles/use-article-stats';

interface Props {}

const PopularAuthors: FC<Props> = () => {
    const params = useParams();

    const { data: articleTop } = useArticleTop({
        category: params.category as API.ArticleCategory,
    });

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Популярні автори</HeaderTitle>
                </HeaderContainer>
            </Header>
            <div className="flex flex-col gap-6">
                {articleTop?.authors.map((author) => (
                    <HorizontalCard
                        key={author.user.username}
                        href={author.user.username}
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
