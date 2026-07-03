import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleTopOptions } from '@hikka/api';

import FollowButton from '@/components/action-buttons/follow-button';
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

type Props = {};

const PopularAuthors: FC<Props> = () => {
    const { data: articleTop } = useQuery(getArticleTopOptions());

    return (
        <Card>
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Популярні автори</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <div className="flex flex-col gap-6">
                    {articleTop?.authors.slice(0, 4).map((author) => (
                        <HorizontalCard key={author.user.username}>
                            <HorizontalCardImage
                                imageRatio={1}
                                className="w-10"
                                image={author.user.avatar}
                                href={`/u/${author.user.username}`}
                            />
                            <HorizontalCardContainer>
                                <HorizontalCardTitle
                                    href={`/u/${author.user.username}`}
                                >
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
