import type { FC } from 'react';

import { type CommentResponse, ContentTypeEnum } from '@hikka/api';

import VoteButton from '@/components/action-buttons/vote-button';
import { statItemVariants } from '@/components/ui/stat-item';
import { cn } from '@/utils/cn';

type Props = {
    comment: CommentResponse;
};

const CommentVote: FC<Props> = ({ comment }) => {
    return (
        <div className={cn(statItemVariants(), 'px-0')}>
            <VoteButton
                contentType={ContentTypeEnum.COMMENT}
                slug={comment.reference}
                myScore={comment.my_score}
                voteScore={comment.vote_score}
                size="icon-sm"
            />
        </div>
    );
};

export default CommentVote;
