'use client';

import { ArticleBaseResponse, ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import { buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';

import VoteButton from '@/features/common/vote-button';

interface Props {
    article: ArticleBaseResponse;
}

const ArticleVote: FC<Props> = ({ article }) => {
    return (
        <Card
            className={buttonVariants({
                variant: 'secondary',
                size: 'md',
                className: 'flex-row p-0 overflow-hidden border-none gap-0',
            })}
        >
            <VoteButton
                contentType={ContentTypeEnum.ARTICLE}
                slug={article.slug}
                myScore={article.my_score}
                voteScore={article.vote_score}
            />
        </Card>
    );
};

export default ArticleVote;
