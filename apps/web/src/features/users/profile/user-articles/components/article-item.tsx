import { ArticleBaseResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import { ArrowBigUp, MessageCircle } from 'lucide-react';
import { FC } from 'react';

import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
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
                <small className="text-muted-foreground">
                    {formatDistance(article.updated * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </small>
                <div className="text-muted-foreground flex gap-3 text-xs">
                    {article.views > 0 && (
                        <div className="flex items-center gap-1">
                            <MaterialSymbolsVisibilityOutlineRounded className="size-3" />
                            <small>{article.views}</small>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <MessageCircle className="size-3" />
                        {article.comments_count > 0 && (
                            <small>{article.comments_count}</small>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowBigUp className="size-4" />
                        {article.vote_score > 0 && (
                            <small>{article.vote_score}</small>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ArticleItem;
