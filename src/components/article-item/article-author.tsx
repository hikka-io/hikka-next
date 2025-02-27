import { formatDistance } from 'date-fns';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

import FollowButton from '../follow-button';

interface Props {
    article: API.Article;
}

const Author: FC<Props> = ({ article }) => {
    return (
        <HorizontalCard href={`/u/${article.author.username}`} className="p-4">
            <HorizontalCardImage image={article.author.avatar} imageRatio={1} />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle>
                    {article.author.username}
                </HorizontalCardTitle>
                <HorizontalCardContainer className="flex-row items-center">
                    <HorizontalCardDescription>
                        {ARTICLE_CATEGORY_OPTIONS[article.category].title_ua}
                    </HorizontalCardDescription>
                    <div className="size-1 rounded-full bg-muted-foreground" />
                    <HorizontalCardDescription>
                        {formatDistance(article.updated * 1000, Date.now(), {
                            addSuffix: true,
                        })}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCardContainer>
            <FollowButton size="md" user={article.author} />
        </HorizontalCard>
    );
};

export default Author;
