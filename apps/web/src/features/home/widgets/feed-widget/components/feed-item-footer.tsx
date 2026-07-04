import type { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import type { VoteContentTypeEnum } from '@hikka/api';

import VoteButton from '@/components/action-buttons/vote-button';
import {
    StatItem,
    StatItemGroup,
    statItemVariants,
} from '@/components/ui/stat-item';
import { Link } from '@/utils/navigation';

type Props = {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType?: VoteContentTypeEnum;
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
        <div className="flex items-center justify-between">
            <StatItemGroup>
                {contentType && slug !== undefined && myScore !== undefined && (
                    // VoteButton renders a fragment, so it can't be a
                    // `StatItem asChild` child; wrap it in a styled element.
                    <div className={statItemVariants()}>
                        <VoteButton
                            contentType={contentType}
                            slug={slug}
                            myScore={myScore}
                            voteScore={voteScore}
                            size="icon-sm"
                        />
                    </div>
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
