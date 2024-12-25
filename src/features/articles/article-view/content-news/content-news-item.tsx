import { format } from 'date-fns/format';
import { FC } from 'react';

import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import MaterialSymbolsDriveFileRenameOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsDriveFileRenameOutlineRounded';
import Small from '@/components/typography/small';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {
    article: API.Article;
    className?: string;
}

const ContentNewsItem: FC<Props> = ({ article, className }) => {
    return (
        <HorizontalCard
            className={className}
            href={`/${article.category}/${article.slug}`}
            key={article.slug}
        >
            <HorizontalCardContainer>
                <HorizontalCardTitle>{article.title}</HorizontalCardTitle>
                <HorizontalCardDescription className="flex-row text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <IconamoonCommentFill />
                        <Small>{article.comments_count}</Small>
                    </div>
                    <div className="flex items-center gap-1">
                        <BxBxsUpvote />
                        <Small>{article.vote_score}</Small>
                    </div>
                    <div className="flex items-center gap-1">
                        <MaterialSymbolsDriveFileRenameOutlineRounded />
                        <Small>
                            {format(new Date(article.updated * 1000), 'd.MM.Y')}
                        </Small>
                    </div>
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {article.cover && (
                <HorizontalCardImage
                    className="w-16"
                    imageRatio={1.5}
                    image={article.cover}
                />
            )}
        </HorizontalCard>
    );
};

export default ContentNewsItem;
