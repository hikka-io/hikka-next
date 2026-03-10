import { ArticleBaseResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import { ArrowBigUp, Eye, MessageCircle } from 'lucide-react';
import { FC } from 'react';

import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    article: ArticleBaseResponse;
}

const ArticleItem: FC<Props> = ({ article }) => {
    return (
        <Card className="gap-2">
            <HorizontalCard>
                <HorizontalCardContainer>
                    <HorizontalCardTitle href={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}>{article.title}</HorizontalCardTitle>
                </HorizontalCardContainer>
            </HorizontalCard>
            <div className="flex items-center justify-between gap-3">
                <small className="text-muted-foreground">
                    {formatDistance(article.updated * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </small>
                <StatItemGroup size="sm">
                    {article.views > 0 && (
                        <StatItem size="sm">
                            <Eye />
                            <small>{article.views}</small>
                        </StatItem>
                    )}
                    <StatItem size="sm">
                        <MessageCircle />
                        {article.comments_count > 0 && (
                            <small>{article.comments_count}</small>
                        )}
                    </StatItem>
                    <StatItem size="sm">
                        <ArrowBigUp className="size-4!" />
                        {article.vote_score > 0 && (
                            <small>{article.vote_score}</small>
                        )}
                    </StatItem>
                </StatItemGroup>
            </div>
        </Card>
    );
};

export default ArticleItem;
