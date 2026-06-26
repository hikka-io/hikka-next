import type { ComponentProps, FC } from 'react';

import { type CommentResponse, ContentTypeEnum } from '@hikka/api';

import VoteButton from '@/components/action-buttons/vote-button';

type Props = {
    comment: CommentResponse;
};

const CommentVote: FC<Props> = ({ comment }) => {
    return (
        <div className="group flex items-center gap-1">
            <VoteButton
                // TODO(phase2): drop cast once VoteButton is migrated to @hikka/api types
                contentType={
                    ContentTypeEnum.COMMENT as ComponentProps<
                        typeof VoteButton
                    >['contentType']
                }
                slug={comment.reference}
                myScore={comment.my_score}
                voteScore={comment.vote_score}
                size="icon-xs"
            />
        </div>
    );
};

export default CommentVote;
