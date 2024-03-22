import React from 'react';
import MaterialSymbolsKeyboardArrowDownRounded from '~icons/material-symbols/keyboard-arrow-down-rounded';
import MaterialSymbolsKeyboardArrowUpRounded from '~icons/material-symbols/keyboard-arrow-up-rounded';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import vote from '@/services/api/vote/vote';
import { useAuthContext } from '@/services/providers/auth-provider';
import { cn } from '@/utils';

interface Props {
    comment: API.Comment;
}

const Component = ({ comment }: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    // const [newScore, setNewScore] = useState(comment.score);

    const handleCommentVote = async (score: -1 | 1) => {
        const updated = comment.my_score === score ? 0 : score;

        // setNewScore(comment.score + updated);

        await vote({
            secret: String(secret),
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
        <div className="flex items-center gap-2 opacity-60 hover:opacity-100">
            <Button
                onClick={() => handleCommentVote(1)}
                disabled={!secret}
                variant={comment.my_score === 1 ? 'success' : 'ghost'}
                size="icon-xs"
                className={cn(
                    'text-lg',
                    comment.my_score === 1 ? '' : 'text-muted-foreground',
                )}
            >
                <MaterialSymbolsKeyboardArrowUpRounded />
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
                disabled={!secret}
                variant={comment.my_score === -1 ? 'destructive' : 'ghost'}
                size="icon-xs"
                className={cn(
                    'text-lg',
                    comment.my_score === -1 ? '' : 'text-muted-foreground',
                )}
            >
                <MaterialSymbolsKeyboardArrowDownRounded />
            </Button>
        </div>
    );
};

export default Component;
