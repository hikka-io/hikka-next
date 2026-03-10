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
    const { currentScore, handleVote } = useVote({
        contentType,
        slug,
        myScore,
    });

    return (
        <>
            <Button
                onClick={() => handleVote(1)}
                variant="ghost"
                size={size}
                className={cn(
                    'font-normal',
                    currentScore === 1
                        ? 'text-success-foreground opacity-100'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigUp
                    className={cn(
                        'size-5!',
                        currentScore === 1 && 'fill-success-foreground',
                    )}
                />
            </Button>
            <Label
                className={
                    voteScore > 0
                        ? 'text-success-foreground'
                        : voteScore === 0
                            ? 'text-muted-foreground'
                            : 'text-destructive-foreground'
                }
            >
                {voteScore}
            </Label>
            <Button
                onClick={() => handleVote(-1)}
                variant="ghost"
                size={size}
                className={cn(
                    'font-normal',
                    currentScore === -1
                        ? 'text-destructive-foreground opacity-100'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigDown
                    className={cn(
                        'size-5!',
                        currentScore === -1 && 'fill-destructive-foreground',
                    )}
                />
            </Button>
        </>
    );
};

export default VoteButton;
