import type { FC, ReactNode } from 'react';

import { MessageCircle } from 'lucide-react';

import type { VoteContentTypeEnum } from '@hikka/api';

import {
    StatItem,
    StatItemGroup,
    statItemVariants,
} from '@/components/ui/stat-item';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import VoteButton from './vote-button';

type Props = {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType?: VoteContentTypeEnum;
    slug?: string;
    myScore?: number;
    /** Extra stats after the comments, e.g. an article's views. */
    children?: ReactNode;
    className?: string;
};

const VoteCommentsFooter: FC<Props> = ({
    commentsCount,
    voteScore,
    commentsHref,
    contentType,
    slug,
    myScore,
    children,
    className,
}) => {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            <StatItemGroup>
                {contentType && slug !== undefined && myScore !== undefined && (
                    // VoteButton renders a fragment, so it can't be a
                    // `StatItem asChild` child; wrap it in a styled element.
                    <div className={cn(statItemVariants(), 'px-0')}>
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
                    <StatItem render={<Link to={commentsHref} />}>
                        <MessageCircle />
                        {commentsCount > 0 && commentsCount}
                    </StatItem>
                ) : (
                    <StatItem>
                        <MessageCircle />
                        {commentsCount > 0 && commentsCount}
                    </StatItem>
                )}
                {children}
            </StatItemGroup>
        </div>
    );
};

export default VoteCommentsFooter;
