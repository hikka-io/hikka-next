'use client';

import { ContentTypeEnum } from '@hikka/client';
import { ArrowBigUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import { useVote } from '@/features/common/vote-button';
import { cn } from '@/utils/cn';

interface Props {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType: ContentTypeEnum;
    slug: string;
    myScore: number;
}

const FeedItemFooter: FC<Props> = ({
    commentsCount,
    voteScore,
    commentsHref,
    contentType,
    slug,
    myScore,
}) => {
    const { currentScore, handleVote } = useVote({
        contentType: contentType as any,
        slug,
        myScore,
    });

    return (
        <div className="flex items-center justify-between p-4">
            <StatItemGroup>
                {commentsHref ? (
                    <StatItem asChild>
                        <Link href={commentsHref}>
                            <MessageCircle />
                            {commentsCount > 0 && commentsCount}
                        </Link>
                    </StatItem>
                ) : (
                    <StatItem>
                        <MessageCircle />
                        {commentsCount > 0 && commentsCount}
                    </StatItem>
                )}
                <StatItem
                    className={cn(
                        currentScore === 1 && 'text-success-foreground',
                    )}
                    onClick={() => handleVote(1)}
                >
                    <ArrowBigUp
                        className={cn(
                            'size-5!',
                            currentScore === 1 && 'fill-success-foreground',
                        )}
                    />
                    {voteScore}
                </StatItem>
            </StatItemGroup>
        </div>
    );
};

export default FeedItemFooter;
