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
