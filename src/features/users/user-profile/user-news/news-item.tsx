import { formatDistance } from 'date-fns/formatDistance';
import { FC } from 'react';

import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import Small from '@/components/typography/small';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    article: API.Article;
}

const NewsItem: FC<Props> = ({ article }) => {
    return (
        <Card className="gap-2">
            <HorizontalCard
                href={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}
            >
                <HorizontalCardContainer>
                    <HorizontalCardTitle>{article.title}</HorizontalCardTitle>
                </HorizontalCardContainer>
                {article.cover && (
                    <HorizontalCardImage
                        image={article.cover}
                        imageRatio={1.5}
                        className="w-16"
                    />
                )}
            </HorizontalCard>
            <div className="flex items-center justify-between">
                <Small className="text-muted-foreground">
                    {formatDistance(article.updated * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </Small>
                <div className="flex gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <IconamoonCommentFill />
                        <Small>{article.comments_count}</Small>
                    </div>
                    <div className="flex items-center gap-1">
                        <BxBxsUpvote />
                        <Small>{article.vote_score}</Small>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default NewsItem;
