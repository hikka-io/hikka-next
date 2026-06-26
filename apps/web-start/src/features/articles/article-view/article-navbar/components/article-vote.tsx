import type { ComponentProps, FC } from 'react';

import {
    AppVoteSchemasContentTypeEnum,
    type ArticleDocumentResponse,
} from '@hikka/api';

import VoteButton from '@/components/action-buttons/vote-button';
import { buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';

type Props = {
    article: ArticleDocumentResponse;
};

const ArticleVote: FC<Props> = ({ article }) => {
    return (
        <Card
            className={buttonVariants({
                variant: 'secondary',
                size: 'md',
                className: 'flex-row gap-0 overflow-hidden border-none p-0',
            })}
        >
            {/* TODO(phase2): drop cast once VoteButton is migrated to @hikka/api types */}
            <VoteButton
                contentType={
                    AppVoteSchemasContentTypeEnum.ARTICLE as ComponentProps<
                        typeof VoteButton
                    >['contentType']
                }
                slug={article.slug}
                myScore={article.my_score}
                voteScore={article.vote_score}
            />
        </Card>
    );
};

export default ArticleVote;
