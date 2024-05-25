import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import BxBxsDownvote from '~icons/bx/bxs-downvote';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import BxDownvote from '~icons/bx/downvote';
import BxUpvote from '~icons/bx/upvote';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import vote from '@/services/api/vote/vote';
import useSession from '@/services/hooks/auth/use-session';
import { cn } from '@/utils/utils';

interface Props {
    comment: API.Comment;
}

const CommentVote: FC<Props> = ({ comment }) => {
    const { user: loggedUser } = useSession();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: vote,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['comments'] });
            await queryClient.invalidateQueries({
                queryKey: ['commentThread'],
            });
        },
    });

    const handleCommentVote = async (score: -1 | 1) => {
        const updated = comment.my_score === score ? 0 : score;

        mutation.mutate({
            params: {
                slug: comment.reference,
                score: updated,
                content_type: 'comment',
            },
        });
    };

    return (
        <div className="group flex items-center gap-2">
            <Button
                onClick={() => handleCommentVote(1)}
                disabled={!loggedUser}
                variant={'ghost'}
                size="icon-xs"
                className={cn(
                    ' opacity-60 group-hover:opacity-100',
                    comment.my_score === 1 ? '' : 'text-muted-foreground',
                )}
            >
                {comment.my_score === 1 ? (
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
                disabled={!loggedUser}
                variant={'ghost'}
                size="icon-xs"
                className={cn(
                    'opacity-60 group-hover:opacity-100',
                    comment.my_score === -1 ? '' : 'text-muted-foreground',
                )}
            >
                {comment.my_score === -1 ? (
                    <BxBxsDownvote className="text-destructive" />
                ) : (
                    <BxDownvote />
                )}
            </Button>
        </div>
    );
};

export default CommentVote;
