'use client';

import { VoteContentType } from '@hikka/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';

import { useVote } from './use-vote';

export { useVote } from './use-vote';

interface Props {
    contentType: VoteContentType;
    slug: string;
    myScore: number;
    voteScore: number;
    size?: 'icon-xs' | 'icon-sm' | 'icon-md';
}

const VoteButton: FC<Props> = ({
    contentType,
    slug,
    myScore,
    voteScore,
    size = 'icon-md',
}) => {
    const { currentMyScore, optimisticVoteScore, handleVote } = useVote({
        contentType,
        slug,
        myScore,
        voteScore,
    });

    return (
        <>
            <Button
                onClick={() => handleVote(1)}
                variant="ghost"
                size={size}
                className={cn(
                    'font-normal',
                    currentMyScore === 1
                        ? 'text-success-foreground hover:text-success-foreground'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigUp
                    className={cn(
                        'size-5!',
                        currentMyScore === 1 && 'fill-success-foreground',
                    )}
                />
            </Button>
            <Label
                className={
                    optimisticVoteScore > 0
                        ? 'text-success-foreground'
                        : optimisticVoteScore === 0
                            ? 'text-muted-foreground'
                            : 'text-destructive-foreground'
                }
            >
                {optimisticVoteScore}
            </Label>
            <Button
                onClick={() => handleVote(-1)}
                variant="ghost"
                size={size}
                className={cn(
                    'font-normal',
                    currentMyScore === -1
                        ? 'text-destructive-foreground hover:text-destructive-foreground'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigDown
                    className={cn(
                        'size-5!',
                        currentMyScore === -1 && 'fill-destructive-foreground',
                    )}
                />
            </Button>
        </>
    );
};

export default VoteButton;
