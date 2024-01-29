import React, { useEffect, useState } from 'react';
import MaterialSymbolsKeyboardArrowDownRounded from '~icons/material-symbols/keyboard-arrow-down-rounded';
import MaterialSymbolsKeyboardArrowUpRounded from '~icons/material-symbols/keyboard-arrow-up-rounded';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import voteComment from '@/utils/api/comments/voteComment';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { cn } from '@/utils';

interface Props {
    comment: Hikka.Comment;
}

const Component = ({ comment }: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    // const [newScore, setNewScore] = useState(comment.score);

    const handleCommentVote = async (score: -1 | 1) => {
        const updated = comment.my_score === score ? 0 : score;

        // setNewScore(comment.score + updated);

        await voteComment({
            secret: String(secret),
            reference: comment.reference,
            score: updated,
        });

        await queryClient.invalidateQueries({ queryKey: ['comments'] });
    };

    /*useEffect(() => {
        setNewScore(comment.score);
    }, [comment]);*/

    return (
        <div className="flex gap-2 items-center opacity-60 hover:opacity-100">
            <Button
                onClick={() => handleCommentVote(-1)}
                disabled={!secret}
                variant={comment.my_score === -1 ? "destructive" : "ghost"}
                size="icon-xs"
                className={cn("text-lg", comment.my_score === -1 ? "" : "text-muted-foreground")}
            >
                <MaterialSymbolsKeyboardArrowDownRounded />
            </Button>
            <Label className={comment.score > 0 ? "text-success" : comment.score === 0 ? "text-foreground" : "text-destructive"}>{comment.score}</Label>
            <Button
                onClick={() => handleCommentVote(1)}
                disabled={!secret}
                variant={comment.my_score === 1 ? "success" : "ghost"}
                size="icon-xs"
                className={cn("text-lg", comment.my_score === 1 ? "" : "text-muted-foreground")}
            >
                <MaterialSymbolsKeyboardArrowUpRounded />
            </Button>
        </div>
    );
};

export default Component;