import { ArticleResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import { FC } from 'react';

import MaterialSymbolsDriveFileRenameOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsDriveFileRenameOutlineRounded';
import Small from '@/components/typography/small';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    article: ArticleResponse;
    className?: string;
}

const ContentArticlesItem: FC<Props> = ({ article, className }) => {
    return (
        <HorizontalCard
            className={className}
            href={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}
            key={article.slug}
        >
            <HorizontalCardImage
                href={`/u/${article.author.username}`}
                image={article.author.avatar}
                imageRatio={1}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{article.title}</HorizontalCardTitle>
                <HorizontalCardDescription className="text-muted-foreground flex-row text-xs">
                    <div className="flex items-center gap-1">
                        <MaterialSymbolsDriveFileRenameOutlineRounded />
                        <Small>
                            {formatDistance(
                                article.updated * 1000,
                                Date.now(),
                                {
                                    addSuffix: true,
                                },
                            )}
                        </Small>
                    </div>
                </HorizontalCardDescription>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default ContentArticlesItem;
