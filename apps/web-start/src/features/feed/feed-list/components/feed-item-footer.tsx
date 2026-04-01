'use client';

import { VoteContentType } from '@hikka/client';
import { MessageCircle } from 'lucide-react';
import { FC } from 'react';

import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import VoteButton from '@/features/common/vote-button';

import { Link } from '@/utils/navigation';

interface Props {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType?: VoteContentType;
    slug?: string;
    myScore?: number;
}

const FeedItemFooter: FC<Props> = ({
    commentsCount,
    voteScore,
    commentsHref,
    contentType,
    slug,
    myScore,
}) => {
    return (
        <div className="flex items-center justify-between p-4">
            <StatItemGroup>
                {contentType && slug !== undefined && myScore !== undefined && (
                    <StatItem asChild>
                        <VoteButton
                            contentType={contentType}
                            slug={slug}
                            myScore={myScore}
                            voteScore={voteScore}
                            size="icon-sm"
                        />
                    </StatItem>
                )}
                {commentsHref ? (
                    <StatItem asChild>
                        <Link to={commentsHref}>
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
            </StatItemGroup>
        </div>
    );
};

export default FeedItemFooter;
