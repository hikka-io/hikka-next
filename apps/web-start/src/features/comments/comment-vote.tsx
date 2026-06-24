'use client';

import type { FC } from 'react';

import { type CommentResponse, ContentTypeEnum } from '@hikka/client';

import VoteButton from '@/features/common/vote-button';

type Props = {
    comment: CommentResponse;
};

const CommentVote: FC<Props> = ({ comment }) => {
    return (
        <div className="group flex items-center gap-1">
            <VoteButton
                contentType={ContentTypeEnum.COMMENT}
                slug={comment.reference}
                myScore={comment.my_score}
                voteScore={comment.vote_score}
                size="icon-xs"
            />
        </div>
    );
};

export default CommentVote;
