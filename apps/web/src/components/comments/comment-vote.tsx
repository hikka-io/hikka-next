import { CommentResponse, ContentTypeEnum } from '@hikka/client';
import { useSession, useSetVote } from '@hikka/react';
import { FC } from 'react';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import BxBxsDownvote from '../icons/bx/BxBxsDownvote';
import BxBxsUpvote from '../icons/bx/BxBxsUpvote';
import BxDownvote from '../icons/bx/BxDownvote';
import BxUpvote from '../icons/bx/BxUpvote';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface Props {
    comment: CommentResponse;
}

const CommentVote: FC<Props> = ({ comment }) => {
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    const mutation = useSetVote();

    const currentScore = mutation.variables?.score
        ? mutation.variables?.score
        : comment.my_score;

    const handleCommentVote = async (score: -1 | 1) => {
        if (!loggedUser) {
            openModal({
                content: <AuthModal type="login" />,
                className: 'max-w-3xl p-0',
                forceModal: true,
            });

            return;
        }

        const updated = currentScore === score ? 0 : score;

        mutation.mutate({
            contentType: ContentTypeEnum.COMMENT,
            slug: comment.reference,
            score: updated,
        });
    };

    return (
        <div className="group flex items-center gap-2">
            <Button
                onClick={() => handleCommentVote(1)}
                variant={'ghost'}
                size="icon-xs"
                className={cn(
                    ' opacity-60 group-hover:opacity-100',
                    currentScore === 1 ? '' : 'text-muted-foreground',
                )}
            >
                {currentScore === 1 ? (
                    <BxBxsUpvote className="text-success" />
                ) : (
                    <BxUpvote />
                )}
            </Button>
            <Label
                className={
                    comment.vote_score > 0
                        ? 'text-success'
                        : comment.vote_score === 0
                          ? 'text-foreground'
                          : 'text-destructive'
                }
            >
                {comment.vote_score}
            </Label>
            <Button
                onClick={() => handleCommentVote(-1)}
                variant={'ghost'}
                size="icon-xs"
                className={cn(
                    'opacity-60 group-hover:opacity-100',
                    currentScore === -1 ? '' : 'text-muted-foreground',
                )}
            >
                {currentScore === -1 ? (
                    <BxBxsDownvote className="text-destructive" />
                ) : (
                    <BxDownvote />
                )}
            </Button>
        </div>
    );
};

export default CommentVote;
