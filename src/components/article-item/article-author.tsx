import { formatDistance } from 'date-fns';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {
    article: API.Article;
}

const Author: FC<Props> = ({ article }) => {
    return (
        <HorizontalCard href={`/u/${article.author.username}`} className="p-4">
            <HorizontalCardImage image={article.author.avatar} imageRatio={1} />
            <HorizontalCardContainer className="gap-0">
                <HorizontalCardTitle>
                    {article.author.username}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    {formatDistance(article.updated * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {/* <div className="flex gap-2">
                <Button size="md" variant="outline">
                    Відстежується
                </Button>
                <Button size="icon-md" variant="outline">
                    <MaterialSymbolsMoreHoriz className="size-4" />
                </Button>
            </div> */}
        </HorizontalCard>
    );
};

export default Author;
