import React from 'react';
import BxBxsDownvote from '~icons/bx/bxs-downvote';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import BxDownvote from '~icons/bx/downvote';
import BxUpvote from '~icons/bx/upvote';



import { useQueryClient } from '@tanstack/react-query';



import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import vote from '@/services/api/vote/vote';
import useAuth from '@/services/hooks/auth/useAuth';

import { cn } from '@/utils/utils';


interface Props {
    comment: API.Comment;
}

const Component = ({ comment }: Props) => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    // const [newScore, setNewScore] = useState(comment.score);

    const handleCommentVote = async (score: -1 | 1) => {
        const updated = comment.my_score === score ? 0 : score;

        // setNewScore(comment.score + updated);

        await vote({
            auth: String(auth),
            slug: comment.reference,
            score: updated,
            content_type: 'comment',
        });

        await queryClient.invalidateQueries({ queryKey: ['comments'] });
    };

    /*useEffect(() => {
        setNewScore(comment.score);
    }, [comment]);*/

    return (
        <div className="group flex items-center gap-2">
            <Button
                onClick={() => handleCommentVote(1)}
                disabled={!auth}
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
                disabled={!auth}
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

export default Component;
