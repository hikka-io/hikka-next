import type { FC } from 'react';

import { ArrowBigDown, ArrowBigUp } from 'lucide-react';

import type { VoteContentTypeEnum } from '@hikka/api';

import { Button, buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

import { useVote } from './use-vote';

type Props = {
    contentType: VoteContentTypeEnum;
    slug: string;
    myScore: number;
    voteScore: number;
    size?: 'icon-xs' | 'icon-sm' | 'icon-md';
    variant?: 'card';
};

const VoteButton: FC<Props> = ({
    contentType,
    slug,
    myScore,
    voteScore,
    size = 'icon-md',
    variant,
}) => {
    const { currentMyScore, optimisticVoteScore, handleVote } = useVote({
        contentType,
        slug,
        myScore,
        voteScore,
    });

    const buttons = (
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

    if (variant !== 'card') {
        return buttons;
    }

    return (
        <Card
            className={buttonVariants({
                variant: 'secondary',
                size: 'md',
                className: 'flex-row gap-0 overflow-hidden border-none p-0',
            })}
        >
            {buttons}
        </Card>
    );
};

export default VoteButton;
