import { ArticleBaseResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import { ArrowBigUp, MessageCircle } from 'lucide-react';
import { FC } from 'react';

import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import Small from '@/components/typography/small';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    article: ArticleBaseResponse;
}

const ArticleItem: FC<Props> = ({ article }) => {
    return (
        <Card className="gap-2">
            <HorizontalCard
                href={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}
            >
                <HorizontalCardContainer>
                    <HorizontalCardTitle>{article.title}</HorizontalCardTitle>
                </HorizontalCardContainer>
            </HorizontalCard>
            <div className="flex items-center justify-between gap-3">
                <Small className="text-muted-foreground">
                    {formatDistance(article.updated * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </Small>
                <div className="text-muted-foreground flex gap-3 text-xs">
                    {article.views > 0 && (
                        <div className="flex items-center gap-1">
                            <MaterialSymbolsVisibilityOutlineRounded className="size-3" />
                            <Small>{article.views}</Small>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <MessageCircle className="size-3" />
                        {article.comments_count > 0 && (
                            <Small>{article.comments_count}</Small>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowBigUp className="size-4" />
                        {article.vote_score > 0 && (
                            <Small>{article.vote_score}</Small>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ArticleItem;
