import type { FC } from 'react';

import { ArrowBigUp, Eye, MessageCircle } from 'lucide-react';

import type { ArticlePreviewResponse } from '@hikka/api';

import RelativeTime from '@/components/relative-time';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

type Props = {
    article: ArticlePreviewResponse;
};

const ArticleItem: FC<Props> = ({ article }) => {
    return (
        <Card className="gap-2">
            <HorizontalCard>
                <HorizontalCardContainer>
                    <HorizontalCardTitle
                        href={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}
                    >
                        {article.title}
                    </HorizontalCardTitle>
                </HorizontalCardContainer>
            </HorizontalCard>
            <div className="flex items-center justify-between gap-3">
                <RelativeTime value={article.updated} />
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
