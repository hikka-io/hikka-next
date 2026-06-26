import type { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import type { AppVoteSchemasContentTypeEnum } from '@hikka/api';

import VoteButton from '@/components/action-buttons/vote-button';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Link } from '@/utils/navigation';

type Props = {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType?: AppVoteSchemasContentTypeEnum;
    slug?: string;
    myScore?: number;
};

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
