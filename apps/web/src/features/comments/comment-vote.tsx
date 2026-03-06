'use client';

import { CommentResponse, ContentTypeEnum } from '@hikka/client';
import { useCreateVote, useSession } from '@hikka/react';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';

interface Props {
    comment: CommentResponse;
}

const CommentVote: FC<Props> = ({ comment }) => {
    const { user: loggedUser } = useSession();
    const router = useRouter();

    const mutation = useCreateVote();

    const currentScore = mutation.variables?.score
        ? mutation.variables?.score
        : comment.my_score;

    const handleCommentVote = async (score: -1 | 1) => {
        if (!loggedUser) {
            router.push('/login');
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
        <div className="group flex items-center gap-1">
            <Button
                onClick={() => handleCommentVote(1)}
                variant={'ghost'}
                size="icon-xs"
                className={cn(
                    'opacity-60 group-hover:opacity-100 font-normal',
                    currentScore === 1
                        ? 'text-success-foreground opacity-100'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigUp
                    className={cn(
                        '!size-5',
                        currentScore === 1 && 'fill-success-foreground',
                    )}
                />
            </Button>
            <Label
                className={
                    comment.vote_score > 0
                        ? 'text-success-foreground'
                        : comment.vote_score === 0
                            ? 'text-foreground'
                            : 'text-destructive-foreground'
                }
            >
                {comment.vote_score}
            </Label>
            <Button
                onClick={() => handleCommentVote(-1)}
                variant={'ghost'}
                size="icon-xs"
                className={cn(
                    'opacity-60 group-hover:opacity-100 font-normal',
                    currentScore === -1
                        ? 'text-destructive-foreground opacity-100'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigDown
                    className={cn(
                        '!size-5',
                        currentScore === -1 && 'fill-destructive-foreground',
                    )}
                />
            </Button>
        </div>
    );
};

export default CommentVote;
